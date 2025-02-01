const { Client } = require('pg');

// Connexion à la base de données PostgreSQL
const client = new Client({
  user: 'postgres', 
  host: 'localhost',
  database: 'pollution_data',
  password: 'moussa007',  
  port: 5432,  
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = client;
