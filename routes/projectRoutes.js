const express = require('express');
const prisma = require('../config/prismaClient');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Obtener todos los proyectos
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({ include: { users: true } });
    res.render('projects/index', { projects, currentRoute: '/projects' });
  } catch (error) {
    console.error('Error al obtener los proyectos:', error.message);
    res.status(500).json({ error: 'Error al obtener los proyectos.' });
  }
});

// Formulario para editar un proyecto
router.get('/:id/edit', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { users: true },
    });
    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }

    const users = await prisma.user.findMany();
    res.render('projects/edit', { project, users, currentRoute: '/projects' });
  } catch (error) {
    console.error('Error al cargar el formulario de edición:', error.message);
    res.status(500).json({ error: 'Error al cargar el formulario de edición.' });
  }
});

module.exports = router;
