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

// Créer un journal d'alerte
exports.createAlertLog = async (req, res) => {
    try {
        const { alert_type, timestamp, sensor_id } = req.body;
        const result = await pool.query(
            'INSERT INTO AlertLogs (alert_type, timestamp, sensor_id) VALUES ($1, $2, $3) RETURNING *',
            [alert_type, timestamp, sensor_id]
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
        const { alert_type, timestamp, sensor_id } = req.body;
        const result = await pool.query(
            'UPDATE AlertLogs SET alert_type = $1, timestamp = $2, sensor_id = $3 WHERE alert_id = $4 RETURNING *',
            [alert_type, timestamp, sensor_id, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Alert Log not found' });
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
        res.json({ message: 'Alert Log deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
