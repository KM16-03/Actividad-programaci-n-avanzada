var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async function(req, res, next) {
  try {
    console.log('Entró a /users/register');

    const { username, password } = req.body;
    console.log('Username recibido en register:', username);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    console.log('Usuario guardado correctamente');

    res.status(201).json({
      message: 'Usuario registrado correctamente'
    });
  } catch (error) {
    console.log('Error en /users/register:', error);
    res.status(500).json({
      error: 'Error en el registro',
      description: error.toString()
    });
  }
});

router.post('/login', async function(req, res, next) {
  try {
    console.log('Entró a /users/login');

    const { username, password } = req.body;
    console.log('Username recibido en login:', username);
    console.log('JWT_SECRET existe:', !!process.env.JWT_SECRET);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        error: 'Usuario no encontrado'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: 'Contraseña incorrecta'
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('habitToken', token, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log('Login correcto');

    res.json({
      message: 'Inicio de sesión exitoso',
      token
    });
  } catch (error) {
    console.log('Error real en /users/login:', error);
    res.status(500).json({
      error: 'Error en el login',
      description: error.toString()
    });
  }
});

module.exports = router;