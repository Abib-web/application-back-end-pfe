const pool = require('../db/db');

// Récupérer tous les capteurs
exports.getAllSensors = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Sensors');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer un capteur par ID
exports.getSensorById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Sensors WHERE sensor_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Sensor not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer un capteur
exports.createSensor = async (req, res) => {
    try {
        const { type, status, location_id } = req.body;
        if (!type || !status || !location_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Vérifier si la location existe
        const locationCheck = await pool.query('SELECT * FROM Locations WHERE location_id = $1', [location_id]);
        if (locationCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }

        const result = await pool.query(
            'INSERT INTO Sensors (type, status, location_id) VALUES ($1, $2, $3) RETURNING *',
            [type, status, location_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour un capteur
exports.updateSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, status, location_id } = req.body;
        if (!type || !status || !location_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Vérifier si la location existe
        const locationCheck = await pool.query('SELECT * FROM Locations WHERE location_id = $1', [location_id]);
        if (locationCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }

        const result = await pool.query(
            'UPDATE Sensors SET type = $1, status = $2, location_id = $3 WHERE sensor_id = $4 RETURNING *',
            [type, status, location_id, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Sensor not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un capteur
exports.deleteSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Sensors WHERE sensor_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Sensor not found' });
        res.json({ message: 'Sensor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};