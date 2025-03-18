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
        const result = await pool.query('SELECT * FROM NetworkQuality WHERE network_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Network Quality not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer une qualité de réseau
exports.createNetworkQuality = async (req, res) => {
    try {
        const { signal_strength, packet_loss, latency, location_id } = req.body;
        if (!signal_strength || !packet_loss || !latency || !location_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Vérifier si la location existe
        const locationCheck = await pool.query('SELECT * FROM Locations WHERE location_id = $1', [location_id]);
        if (locationCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }

        const result = await pool.query(
            'INSERT INTO NetworkQuality (signal_strength, packet_loss, latency, location_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [signal_strength, packet_loss, latency, location_id]
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
        const { signal_strength, packet_loss, latency, location_id } = req.body;
        if (!signal_strength || !packet_loss || !latency || !location_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Vérifier si la location existe
        const locationCheck = await pool.query('SELECT * FROM Locations WHERE location_id = $1', [location_id]);
        if (locationCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }

        const result = await pool.query(
            'UPDATE NetworkQuality SET signal_strength = $1, packet_loss = $2, latency = $3, location_id = $4 WHERE network_id = $5 RETURNING *',
            [signal_strength, packet_loss, latency, location_id, id]
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
        const result = await pool.query('DELETE FROM NetworkQuality WHERE network_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Network Quality not found' });
        res.json({ message: 'Network Quality deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};