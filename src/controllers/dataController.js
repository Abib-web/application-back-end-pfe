// src/controllers/dataController.js
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { parseCSV } = require('../utils/csvParser');

const getDataFromCSV = (req, res) => {
    const filePath = path.join(__dirname, '../../public/stations_quebec_cleaned.csv');
    
    // Lire et parser le fichier CSV
    parseCSV(filePath)
        .then((data) => {
            res.json(data); // Retourner les données traitées
        })
        .catch((err) => {
            res.status(500).json({ error: 'Erreur de traitement des données CSV' });
        });
};

module.exports = { getDataFromCSV };
