const express = require('express');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Asegúrate de que la ruta al modelo sea correcta
const router = express.Router();

const jwtSecret = 'your_jwt_secret_key'; // Cambia esto por una clave secreta segura

// Ruta de registro
router.post('/Register/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario');
    }
});

// Ruta de inicio de sesión
router.post('/Login/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Usuario no encontrado');
        }

        console.log('Contraseña almacenada:', user.password);

        // Compara la contraseña introducida con la almacenada directamente
        if (password !== user.password) {
            return res.status(400).send('Contraseña incorrecta');
        }

        // Genera un token JWT
        const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});

module.exports = router;
