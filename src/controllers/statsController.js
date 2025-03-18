const pool = require('../db/db');

exports.getStats = async (req, res) => {
    try {
        // Récupérer le nombre d'utilisateurs
        const usersCount = await pool.query('SELECT COUNT(*) FROM Users');
        const totalUsers = usersCount.rows[0].count;
    
        // Récupérer le nombre d'administrateurs
        const adminCount = await pool.query(`
          SELECT COUNT(*) 
          FROM Users
          JOIN UserRoles ON Users.user_id = UserRoles.user_id
          JOIN Roles ON UserRoles.role_id = Roles.role_id
          WHERE Roles.role_name = 'admin'
        `);
        
        const totalAdmins = adminCount.rows[0].count;
    
        // Récupérer le nombre de capteurs
        const sensorsCount = await pool.query('SELECT COUNT(*) FROM Sensors');
        const totalSensors = sensorsCount.rows[0].count;

        // Récupérer le nombre de données collectées
        const dataCount = await pool.query('SELECT COUNT(*) FROM airqualitymetrics');
        const totalData = dataCount.rows[0].count;
        
        // Renvoyer les statistiques
        res.json({
          totalUsers,
          totalAdmins,
          totalSensors,
          totalData
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };
  