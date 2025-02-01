const pool = require('../db/db');

// Récupérer toutes les localisations
exports.getAllLocations = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Locations');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer une localisation par ID
exports.getLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Locations WHERE location_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Location not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer une localisation
exports.createLocation = async (req, res) => {
    try {
        const { name, city, region } = req.body;
        const result = await pool.query(
            'INSERT INTO Locations (name, city, region) VALUES ($1, $2, $3) RETURNING *',
            [name, city, region]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour une localisation
exports.updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, city, region } = req.body;
        const result = await pool.query(
            'UPDATE Locations SET name = $1, city = $2, region = $3 WHERE location_id = $4 RETURNING *',
            [name, city, region, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Location not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer une localisation
exports.deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Locations WHERE location_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Location not found' });
        res.json({ message: 'Location deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
