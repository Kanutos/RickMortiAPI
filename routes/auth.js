const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Usuario no encontrado');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Contraseña incorrecta');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
