const express = require('express');
const router = express.Router();

// Importation des contrôleurs
const usersController = require('../controllers/usersController');
const rolesController = require('../controllers/rolesController');
const sensorsController = require('../controllers/sensorsController');

// Routes pour les utilisateurs
router.get('/users', usersController.getAllUsers);
router.get('/users/:id', usersController.getUserById);
router.post('/users', usersController.createUser);
router.put('/users/:id', usersController.updateUser);
router.delete('/users/:id', usersController.deleteUser);

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
router.put('/sensors/:id', sensorsController.updateSensor);
router.delete('/sensors/:id', sensorsController.deleteSensor);


module.exports = router;
