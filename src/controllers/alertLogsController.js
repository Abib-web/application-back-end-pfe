const pool = require('../db/db');

// Récupérer tous les journaux d'alerte
exports.getAllAlertLogs = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM AlertLogs');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer un journal d'alerte par ID
exports.getAlertLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM AlertLogs WHERE alert_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Alert Log not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer un journal d'alerte (avec vérification des clés étrangères et champs requis)
exports.createAlertLog = async (req, res) => {
    try {
        const { alert_type, alert_message, security, sensor_id, timestamp } = req.body;

        // Vérification des champs obligatoires
        if (!alert_type || !sensor_id || !timestamp) {
            return res.status(400).json({ error: 'Missing required fields: alert_type, sensor_id, timestamp' });
        }

        // Vérifier que le sensor_id existe dans Sensors
        const sensorCheck = await pool.query('SELECT * FROM Sensors WHERE sensor_id = $1', [sensor_id]);
        if (sensorCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Sensor not found' });
        }

        // Insertion avec tous les champs
        const result = await pool.query(
            'INSERT INTO AlertLogs (alert_type, alert_message, security, sensor_id, timestamp) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [alert_type, alert_message || null, security || null, sensor_id, timestamp]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour un journal d'alerte
exports.updateAlertLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { alert_type, alert_message, security, sensor_id, timestamp } = req.body;

        // Vérifier si le journal existe
        const alertCheck = await pool.query('SELECT * FROM AlertLogs WHERE alert_id = $1', [id]);
        if (alertCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Alert Log not found' });
        }

        // Vérifier le sensor_id si il est modifié
        if (sensor_id) {
            const sensorCheck = await pool.query('SELECT * FROM Sensors WHERE sensor_id = $1', [sensor_id]);
            if (sensorCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Sensor not found' });
            }
        }

        // Mise à jour
        const result = await pool.query(
            `UPDATE AlertLogs 
            SET alert_type = COALESCE($1, alert_type),
                alert_message = COALESCE($2, alert_message),
                security = COALESCE($3, security),
                sensor_id = COALESCE($4, sensor_id),
                timestamp = COALESCE($5, timestamp)
            WHERE alert_id = $6
            RETURNING *`,
            [alert_type, alert_message, security, sensor_id, timestamp, id]
        );

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un journal d'alerte
exports.deleteAlertLog = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM AlertLogs WHERE alert_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Alert Log not found' });
        res.status(204).send(); // 204 No Content
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};