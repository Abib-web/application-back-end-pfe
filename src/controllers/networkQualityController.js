const pool = require('../db/db');

// Récupérer toutes les qualités de réseau
exports.getAllNetworkQualities = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM NetworkQuality');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer une qualité de réseau par ID
exports.getNetworkQualityById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM NetworkQuality WHERE quality_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Network Quality not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer une qualité de réseau
exports.createNetworkQuality = async (req, res) => {
    try {
        const { signal_strength, latency, location_id } = req.body;
        const result = await pool.query(
            'INSERT INTO NetworkQuality (signal_strength, latency, location_id) VALUES ($1, $2, $3) RETURNING *',
            [signal_strength, latency, location_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour une qualité de réseau
exports.updateNetworkQuality = async (req, res) => {
    try {
        const { id } = req.params;
        const { signal_strength, latency, location_id } = req.body;
        const result = await pool.query(
            'UPDATE NetworkQuality SET signal_strength = $1, latency = $2, location_id = $3 WHERE quality_id = $4 RETURNING *',
            [signal_strength, latency, location_id, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Network Quality not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer une qualité de réseau
exports.deleteNetworkQuality = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM NetworkQuality WHERE quality_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Network Quality not found' });
        res.json({ message: 'Network Quality deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
