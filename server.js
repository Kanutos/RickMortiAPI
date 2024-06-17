const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const screensaversFolder = path.join(__dirname, 'public/imagenes');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tu_base_de_datos';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

app.use(express.static('public'));

app.get('/api/screensavers', (req, res) => {
    fs.readdir(screensaversFolder, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.json(images);
    });
});
// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para servir tus páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/buscador', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Buscador/buscador.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Login/login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Register/register.html'));
});


app.get('/episodios', (req, res) => { // Nueva ruta para los episodios
    res.sendFile(path.join(__dirname, 'public', 'Episodios/episodios.html'));
});


// Usa las rutas de autenticación
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
