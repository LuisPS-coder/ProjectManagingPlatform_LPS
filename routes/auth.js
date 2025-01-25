const express = require('express');
const router = express.Router();
const passport = require('passport');
const prisma = require('../config/prismaClient');
const bcrypt = require('bcrypt');

// Mostrar la página de registro
router.get('/register-page', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('register', { error: req.flash('error') });
});

// Manejar el registro de usuarios
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error', 'Todos los campos son obligatorios.');
      return res.redirect('/auth/register-page');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      req.flash('error', 'El email ya está registrado.');
      return res.redirect('/auth/register-page');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    req.flash('success', 'Usuario registrado con éxito.');
    res.redirect('/auth/login-page');
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    req.flash('error', 'Error en el registro. Inténtalo de nuevo.');
    res.redirect('/auth/register-page');
  }
});

module.exports = router;
