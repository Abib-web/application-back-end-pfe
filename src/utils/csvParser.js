// src/utils/csvParser.js
const fs = require('fs');
const Papa = require('papaparse');

const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject('Erreur de lecture du fichier');
            }

            // Parser le CSV
            Papa.parse(data, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    resolve(result.data); // Retourner les données parsées
                },
                error: (error) => {
                    reject('Erreur de parsing du CSV');
                },
            });
        });
    });
};

module.exports = { parseCSV };
