const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes'); 

const app = express();

// Middleware pour analyser les JSON
app.use(express.json());

// Middleware CORS : placer ceci AVANT vos routes
app.use(cors());

// Vos routes
app.use('/', dataRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
