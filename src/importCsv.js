const bcrypt = require('bcryptjs');
const pool = require('./db/db'); // Assure-toi que c'est la bonne connexion à ta DB

async function updateUserPassword(email, plainPassword) {
    const saltRounds = 12; // Même cost factor que ton hash
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    try {
        const result = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING *',
            [hashedPassword, email]
        );
        console.log(`Mot de passe mis à jour pour ${email}:`, result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de la mise à jour du mot de passe :', err);
    }
}

// Mets à jour le mot de passe pour l'utilisateur "admin@example.com"
updateUserPassword('clara.lefevre@example.com', 'admin');
updateUserPassword('alice.dupont@example.com', 'admin');
updateUserPassword('bob.martin@example.com', 'admin');
updateUserPassword('david.moreau@example.com', 'admin');
updateUserPassword('eve.bernard@example.com', 'admin');
