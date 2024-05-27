require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB Atlas');
}).catch(err => {
    console.log('Error al conectar a MongoDB Atlas:', err);
});

// Rutas
app.use('/api/auth', authRoutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
