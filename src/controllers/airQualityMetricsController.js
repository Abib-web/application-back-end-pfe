const pool = require('../db/db');

// Récupérer toutes les métriques de qualité de l'air
exports.getAllAirQualityMetrics = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM AirQualityMetrics');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer une métrique de qualité de l'air par ID
exports.getAirQualityMetricById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM AirQualityMetrics WHERE metric_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Air Quality Metric not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer une métrique de qualité de l'air
exports.createAirQualityMetric = async (req, res) => {
    try {
        const { co2_level, pm2_5, pm10, location_id } = req.body;
        const result = await pool.query(
            'INSERT INTO AirQualityMetrics (co2_level, pm2_5, pm10, location_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [co2_level, pm2_5, pm10, location_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour une métrique de qualité de l'air
exports.updateAirQualityMetric = async (req, res) => {
    try {
        const { id } = req.params;
        const { co2_level, pm2_5, pm10, location_id } = req.body;
        const result = await pool.query(
            'UPDATE AirQualityMetrics SET co2_level = $1, pm2_5 = $2, pm10 = $3, location_id = $4 WHERE metric_id = $5 RETURNING *',
            [co2_level, pm2_5, pm10, location_id, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Air Quality Metric not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer une métrique de qualité de l'air
exports.deleteAirQualityMetric = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM AirQualityMetrics WHERE metric_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Air Quality Metric not found' });
        res.json({ message: 'Air Quality Metric deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
