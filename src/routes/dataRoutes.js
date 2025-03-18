const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const authController = require('../controllers/authController');
// Importation des contrôleurs
const usersController = require('../controllers/usersController');
const rolesController = require('../controllers/rolesController');
const sensorsController = require('../controllers/sensorsController');
const locationsController = require('../controllers/locationsController');
const networkQualityController = require('../controllers/networkQualityController');
const energyController = require('../controllers/energyManagementController');
const alertController = require('../controllers/alertLogsController');
const airQualityController = require('../controllers/airQualityMetricsController');
const statsController = require('../controllers/statsController');

// Routes pour les utilisateurs
router.get('/users', authMiddleware, usersController.getAllUsers);
router.get('/users/roles', usersController.getAllUsersWithRoles);
router.get('/users/:id', authMiddleware, usersController.getUserById);
router.post('/users', usersController.createUser);
router.put('/users/:id', authMiddleware, usersController.updateUser);
router.delete('/users/:id', authMiddleware, usersController.deleteUser);
// Route pour la connexion
router.post('/login', authController.login);
// Route pour les statistiques
router.get('/stats', authMiddleware, statsController.getStats);

// Routes pour les rôles
router.get('/roles', rolesController.getAllRoles);
router.get('/roles/:id', rolesController.getRoleById);
router.post('/roles', rolesController.createRole);
router.put('/roles/:id', rolesController.updateRole);
router.delete('/roles/:id', rolesController.deleteRole);

// Routes pour les capteurs
router.get('/sensors', sensorsController.getAllSensors);
router.get('/sensors/:id', sensorsController.getSensorById);
router.post('/sensors', sensorsController.createSensor);
router.put('/sensors/update/:id', sensorsController.updateSensor);
router.delete('/sensors/delete/:id', sensorsController.deleteSensor);


// Routes pour les locations
router.get('/locations', locationsController.getAllLocations);
router.get('/locations/:id', locationsController.getLocationById);
router.post('/locations', locationsController.createLocation);
router.put('/locations/:id', locationsController.updateLocation);
router.delete('/locations/:id', locationsController.deleteLocation);

// Routes pour les networkQualityController
router.get('/network-quality', networkQualityController.getAllNetworkQualities);
router.get('/network-quality/:id', networkQualityController.getNetworkQualityById);
router.post('/network-quality', networkQualityController.createNetworkQuality);
router.put('/network-quality/:id', networkQualityController.updateNetworkQuality);
router.delete('/network-quality/:id', networkQualityController.deleteNetworkQuality);

// Routes pour les energyController
router.get('/energy', energyController.getAllEnergyData);
router.get('/energy/:id', energyController.getEnergyDataById);
router.post('/energy', energyController.createEnergyData);
router.put('/energy/:id', energyController.updateEnergyData);
router.delete('/energy/:id', energyController.deleteEnergyData);

// Routes pour les alertController
router.get('/alert', alertController.getAllAlertLogs);
router.get('/alert/:id', alertController.getAlertLogById);
router.post('/alert', alertController.createAlertLog);
router.put('/alert/:id', alertController.updateAlertLog);
router.delete('/alert/:id', alertController.deleteAlertLog);
//router.patch('/alert/:id/read', alertController.markAlertAsRead);


// Routes pour les airQualityController
router.get('/air-quality', airQualityController.getAllAirQualityMetrics);
router.get('/air-quality/:id', airQualityController.getAirQualityMetricById);
router.post('/air-quality', airQualityController.createAirQualityMetric);
router.put('/air-quality/:id', airQualityController.updateAirQualityMetric);
router.delete('/air-quality/:id', airQualityController.deleteAirQualityMetric);
router.get('/air-quality/location/:location_id', airQualityController.getMetricsByLocation);

module.exports = router;
