const express = require('express');
const prisma = require('../config/prismaClient');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Obtener todos los usuarios
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.render('users/index', { users, currentRoute: '/users' });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error.message);
    res.status(500).json({ error: 'Error al obtener los usuarios.' });
  }
});

module.exports = router;
