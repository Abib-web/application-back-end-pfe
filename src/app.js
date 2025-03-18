const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes'); 

const app = express();

// Middleware pour analyser les JSON
app.use(express.json());

// Middleware CORS : placer ceci AVANT vos routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://576f-132-209-10-38.ngrok-free.app']
}));

// Vos routes
app.use('/', dataRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
