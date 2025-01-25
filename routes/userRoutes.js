const express = require('express');
const prisma = require('../config/prismaClient'); 
const isAuthenticated = require('../middlewares/isAuthenticated');
const isAdmin = require('../middlewares/isAdmin');
const bcrypt = require('bcrypt');


const router = express.Router();

// Obtener todos los usuarios
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.render('users/index', { users, currentRoute: '/users' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Crear formulario para un nuevo usuario
router.get('/new', isAuthenticated, isAdmin, (req, res) => {
  res.render('users/new', { currentRoute: '/users' });
});

// Crear un nuevo usuario
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Para depuración
    const { name, email, password, role } = req.body;

    // Validar los datos enviados desde el formulario
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    console.log('Usuario creado:', user); // Confirmar éxito
    res.redirect('/users');
  } catch (error) {
    console.error('Error al crear usuario:', error.message); // Mostrar el error en la consola
    res.status(500).json({ error: 'Error al crear el usuario', details: error.message });
  }
});


// Formulario para editar un usuario
router.get('/:id/edit', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    res.render('users/edit', { user, currentRoute: '/users' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar el usuario' });
  }
});

// Actualizar un usuario
router.post('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email, role },
    });
    res.redirect('/users');
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario
router.post('/:id/delete', isAuthenticated, isAdmin, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.redirect('/users');
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

module.exports = router;