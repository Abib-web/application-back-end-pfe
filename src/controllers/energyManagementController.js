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
        const result = await pool.query(
            `INSERT INTO EnergyManagement (sensor_id, battery_voltage, solar_output, state_of_charge, state_of_health, timestamp) 
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
        const result = await pool.query(
            `UPDATE EnergyManagement 
             SET sensor_id = $1, battery_voltage = $2, solar_output = $3, state_of_charge = $4, state_of_health = $5, timestamp = $6 
             WHERE energy_id = $7 RETURNING *`,
            [sensor_id, battery_voltage, solar_output, state_of_charge, state_of_health, timestamp, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Energy data not found' });
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
        res.json({ message: 'Energy data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
