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
        const { user_id, role_id } = req.body;

        if (!user_id || !role_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await pool.query(
            'INSERT INTO Userroles (user_id, role_id) VALUES ($1, $2) RETURNING *',
            [user_id, role_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err); // Pour afficher l'erreur en console serveur
        res.status(500).json({ error: err.message });
    }
};


// Mettre à jour un rôle
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role_id } = req.body;
        
        if (!role_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await pool.query(
            'UPDATE Userroles SET role_id = $1 WHERE user_id = $2 RETURNING *',
            [role_id, id]
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
        const { user_id } = req.params;
        const { role_id } = req.body;
        console.log("1role_id"+role_id);
        console.log("user_id"+user_id);
        // Vérifier d'abord si le rôle existe pour cet utilisateur
        const checkRole = await pool.query(
            'SELECT * FROM Userroles WHERE user_id = $1 ',
            [user_id]
        );
        console.log(checkRole.rows);
        if (checkRole.rows.length === 0) {
            return res.status(404).json({ error: 'Role not found for this user' });
        }

        // Supprimer le rôle après vérification
        await pool.query('DELETE FROM Userroles WHERE user_id = $1 AND role_id = $2', [user_id, role_id]);

        res.json({ message: 'Role deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
