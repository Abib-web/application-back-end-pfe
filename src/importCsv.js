const path = require('path');
const { parseCSV } = require('./utils/csvParser');
const client = require('./db'); // Importer la connexion existante à la DB

// Fonction pour nettoyer les données et remplacer les colonnes vides par `null`
const cleanRow = (row) => {
  return Object.keys(row).reduce((cleanedRow, key) => {
    cleanedRow[key] = row[key] === '' || row[key] === undefined ? null : row[key];
    return cleanedRow;
  }, {});
};

// Lecture du fichier CSV et insertion dans la base de données
const insertDataFromCSV = async () => {
  try {
    // Le chemin vers ton fichier CSV
    const csvFilePath = path.resolve('public\\stations_quebec_cleaned.csv');
    console.log(`CSV file path: ${csvFilePath}`);

    // Parser le fichier CSV
    const data = await parseCSV(csvFilePath);
    console.log(`CSV file successfully processed. Number of records: ${data.length}`);

    // Préparer la requête d'insertion
    const query = {
      text: `INSERT INTO stations_data (Date_Heure, Station, BC_880nm, CO, H2S, NO2, NO, O3, PM0_1_CPC, PM2_5_BAM, PM2_5_T640, SO2)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    };

    const batchSize = 1000; // Nombre de lignes à insérer par lot
    let batchValues = [];

    for (const row of data) {
      // Nettoyer les données de la ligne
      const cleanedRow = cleanRow(row);

      // Ajouter les valeurs nettoyées au lot
      batchValues.push([
        cleanedRow.Date_Heure,
        cleanedRow.Station,
        cleanedRow.BC_880nm,
        cleanedRow.CO,
        cleanedRow.H2S,
        cleanedRow.NO2,
        cleanedRow.NO,
        cleanedRow.O3,
        cleanedRow.PM0_1_CPC,
        cleanedRow.PM2_5_BAM,
        cleanedRow.PM2_5_T640,
        cleanedRow.SO2,
      ]);

      // Insérer par lot
      if (batchValues.length >= batchSize) {
        try {
          const placeholders = batchValues
            .map(
              (_, i) =>
                `(${[...Array(12).keys()].map((j) => `$${i * 12 + j + 1}`).join(', ')})`
            )
            .join(', ');

          const flattenedValues = batchValues.flat();
          await client.query(
            `INSERT INTO stations_data (Date_Heure, Station, BC_880nm, CO, H2S, NO2, NO, O3, PM0_1_CPC, PM2_5_BAM, PM2_5_T640, SO2) VALUES ${placeholders}`,
            flattenedValues
          );
          console.log(`Batch inserted with ${batchValues.length} records.`);
          batchValues = [];
        } catch (err) {
          console.error('Error inserting batch data:', err.stack);
        }
      }
    }

    // Insérer les données restantes si elles ne forment pas un lot complet
    if (batchValues.length > 0) {
      try {
        const placeholders = batchValues
          .map(
            (_, i) =>
              `(${[...Array(12).keys()].map((j) => `$${i * 12 + j + 1}`).join(', ')})`
          )
          .join(', ');

        const flattenedValues = batchValues.flat();
        await client.query(
          `INSERT INTO stations_data (Date_Heure, Station, BC_880nm, CO, H2S, NO2, NO, O3, PM0_1_CPC, PM2_5_BAM, PM2_5_T640, SO2) VALUES ${placeholders}`,
          flattenedValues
        );
        console.log(`Final batch inserted with ${batchValues.length} records.`);
      } catch (err) {
        console.error('Error inserting final batch data:', err.stack);
      }
    }
  } catch (err) {
    console.error('Error reading CSV file:', err);
  }
};

// Lancer l'importation
insertDataFromCSV();
