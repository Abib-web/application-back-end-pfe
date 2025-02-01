const pool = require('../db/db');

// Récupérer tous les rôles
exports.getAllRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Roles');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer un rôle par ID
exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Roles WHERE role_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Role not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer un rôle
exports.createRole = async (req, res) => {
    try {
        const { role_name } = req.body;
        const result = await pool.query(
            'INSERT INTO Roles (role_name) VALUES ($1) RETURNING *',
            [role_name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour un rôle
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role_name } = req.body;
        const result = await pool.query(
            'UPDATE Roles SET role_name = $1 WHERE role_id = $2 RETURNING *',
            [role_name, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Role not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un rôle
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Roles WHERE role_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Role not found' });
        res.json({ message: 'Role deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
