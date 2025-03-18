const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Accès refusé, aucun token fourni' });
    }

    try {
        const tokenWithoutBearer = token.replace('Bearer ', '');
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré. Veuillez vous reconnecter.' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token invalide' });
        } else {
            return res.status(401).json({ error: 'Erreur d\'authentification' });
        }
    }
};

// Middleware pour vérifier si l'utilisateur est admin
module.exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé, administrateur requis' });
    }
    next();
};
