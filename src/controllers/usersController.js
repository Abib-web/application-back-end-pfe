const pool = require('../db/db');
const bcrypt = require('bcryptjs');

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer tous les utilisateurs
exports.getAllUsersWithRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Users');
        for (let i = 0; i < result.rows.length; i++) {
            const role_id = await pool.query('SELECT role_id FROM userroles WHERE user_id = $1', [result.rows[i].user_id]);
            const roles = await pool.query('SELECT role_name FROM roles WHERE role_id = $1', [role_id.rows[0].role_id]);
            result.rows[i].role_name = roles.rows[0].role_name;
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Users WHERE user_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password_hash } = req.body;
        if (!name || !email || !password_hash) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password_hash, salt);

        const result = await pool.query(
            'INSERT INTO Users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password_hash } = req.body;
        if (!name || !email || !password_hash) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await pool.query(
            'UPDATE Users SET name = $1, email = $2, password_hash = $3, updated_at = CURRENT_TIMESTAMP WHERE user_id = $4 RETURNING *',
            [name, email, password_hash, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Users WHERE user_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};