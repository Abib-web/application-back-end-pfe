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
        const { co_level, no2_level, pm25_level, pm10_level, temperature, humidity, location_id } = req.body;
        
        // Vérification des champs obligatoires
        if (!co_level || !no2_level || !pm25_level || !pm10_level || !temperature || !humidity || !location_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Vérifier si la location existe
        const locationCheck = await pool.query('SELECT * FROM Locations WHERE location_id = $1', [location_id]);
        if (locationCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }

        // Insertion de la nouvelle métrique
        const result = await pool.query(
            'INSERT INTO AirQualityMetrics (co_level, no2_level, pm25_level, pm10_level, temperature, humidity, location_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [co_level, no2_level, pm25_level, pm10_level, temperature, humidity, location_id]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour une métrique existante
exports.updateAirQualityMetric = async (req, res) => {
    try {
        const { id } = req.params;
        const { co_level, no2_level, pm25_level, pm10_level, temperature, humidity, location_id } = req.body;

        // Vérifier si la métrique existe
        const metricCheck = await pool.query('SELECT * FROM AirQualityMetrics WHERE metric_id = $1', [id]);
        if (metricCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Air Quality Metric not found' });
        }

        // Mise à jour
        const result = await pool.query(
            'UPDATE AirQualityMetrics SET co_level = $1, no2_level = $2, pm25_level = $3, pm10_level = $4, temperature = $5, humidity = $6, location_id = $7 WHERE metric_id = $8 RETURNING *',
            [co_level, no2_level, pm25_level, pm10_level, temperature, humidity, location_id, id]
        );

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer une métrique
exports.deleteAirQualityMetric = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si la métrique existe
        const metricCheck = await pool.query('SELECT * FROM AirQualityMetrics WHERE metric_id = $1', [id]);
        if (metricCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Air Quality Metric not found' });
        }

        await pool.query('DELETE FROM AirQualityMetrics WHERE metric_id = $1', [id]);
        res.status(204).send(); // 204 = No Content

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// airQualityMetricsController.js
exports.getMetricsByLocation = async (req, res) => {
    try {
        const { location_id } = req.params;
        const result = await pool.query(
            'SELECT * FROM AirQualityMetrics WHERE location_id = $1 ORDER BY timestamp DESC',
            [location_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};