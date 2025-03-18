const pool = require('../db/db');

// Récupérer toutes les données d'énergie
exports.getAllEnergyData = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM EnergyManagement');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer une donnée d'énergie par ID
exports.getEnergyDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM EnergyManagement WHERE energy_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Energy data not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer une donnée d'énergie
exports.createEnergyData = async (req, res) => {
    try {
        const { sensor_id, battery_voltage, solar_output, state_of_charge, state_of_health, timestamp } = req.body;

        // Vérification des champs obligatoires
        if (!sensor_id || !battery_voltage || !solar_output || !state_of_charge || !state_of_health || !timestamp) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Vérifier que le sensor existe
        const sensorCheck = await pool.query('SELECT * FROM Sensors WHERE sensor_id = $1', [sensor_id]);
        if (sensorCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Sensor not found' });
        }

        // Insertion
        const result = await pool.query(
            `INSERT INTO EnergyManagement 
            (sensor_id, battery_voltage, solar_output, state_of_charge, state_of_health, timestamp) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [sensor_id, battery_voltage, solar_output, state_of_charge, state_of_health, timestamp]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour une donnée d'énergie
exports.updateEnergyData = async (req, res) => {
    try {
        const { id } = req.params;
        const { sensor_id, battery_voltage, solar_output, state_of_charge, state_of_health, timestamp } = req.body;

        // Vérifier si la donnée existe
        const existingData = await pool.query('SELECT * FROM EnergyManagement WHERE energy_id = $1', [id]);
        if (existingData.rows.length === 0) {
            return res.status(404).json({ error: 'Energy data not found' });
        }

        // Vérifier le sensor_id s'il est modifié
        if (sensor_id) {
            const sensorCheck = await pool.query('SELECT * FROM Sensors WHERE sensor_id = $1', [sensor_id]);
            if (sensorCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Sensor not found' });
            }
        }

        // Mise à jour avec COALESCE pour les champs optionnels
        const result = await pool.query(
            `UPDATE EnergyManagement 
            SET sensor_id = COALESCE($1, sensor_id),
                battery_voltage = COALESCE($2, battery_voltage),
                solar_output = COALESCE($3, solar_output),
                state_of_charge = COALESCE($4, state_of_charge),
                state_of_health = COALESCE($5, state_of_health),
                timestamp = COALESCE($6, timestamp)
            WHERE energy_id = $7
            RETURNING *`,
            [sensor_id, battery_voltage, solar_output, state_of_charge, state_of_health, timestamp, id]
        );

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer une donnée d'énergie
exports.deleteEnergyData = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM EnergyManagement WHERE energy_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Energy data not found' });
        res.status(204).send(); // 204 No Content
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};