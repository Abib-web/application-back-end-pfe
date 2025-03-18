const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db/db');
require('dotenv').config();

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing email or password' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const role_id = await pool.query('SELECT role_id FROM userroles WHERE user_id = $1', [result.rows[0].user_id]);
        
        const roles = await pool.query('SELECT role_name FROM roles WHERE role_id = $1', [role_id.rows[0].role_id]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }   

        const user = result.rows[0];

        // Comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // ✅ Retourner aussi le nom
        res.json({ 
            token, 
            user: { 
                id: user.user_id, 
                email: user.email, 
                name: user.name,  // Ajout du nom ici
                role: roles.rows[0].role_name
            }   
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

