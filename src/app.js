const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes'); // Assure-toi que le chemin est correct

const app = express();

// Middleware pour activer les CORS
app.use(cors());

// Routes pour accéder aux données
app.use('/', dataRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
