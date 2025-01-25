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
    res.status(500).json({ error: 'Error al obtener los proyectos' });
  }
});

// Formulario para crear un nuevo proyecto
router.get('/new', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.render('projects/new', { users, currentRoute: '/projects' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar el formulario de creación' });
  }
});

// Crear un nuevo proyecto
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); 
    const { name, description, userIds } = req.body;
   
    if (!name || !userIds) {
      return res.status(400).json({ error: 'Nombre y usuarios son obligatorios.' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        users: {
          connect: userIds.map((id) => ({ id })), 
        },
      },
    });

    console.log('Proyecto creado:', project); 
    res.redirect('/projects');
  } catch (error) {
    console.error('Error al crear proyecto:', error.message); 
    res.status(500).json({ error: 'Error al crear el proyecto', details: error.message });
  }
});


// Formulario para editar un proyecto existente
router.get('/:id/edit', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { users: true }, 
    });
    const users = await prisma.user.findMany();

    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.render('projects/edit', { project, users, currentRoute: '/projects' });
  } catch (error) {
    console.error('Error al cargar el proyecto:', error.message);
    res.status(500).json({ error: 'Error al cargar el formulario de edición.' });
  }
});


// Actualizar un proyecto existente
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { name, description, userIds } = req.body;

    await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        users: {
          set: userIds?.map((id) => ({ id })),
        },
      },
    });

    res.redirect('/projects');
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
});

// Eliminar un proyecto
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.redirect('/projects');
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el proyecto' });
  }
});

// Muestra dashboard de proyectos
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
  
      const project = await prisma.project.findUnique({
        where: { id },
        include: { tasks: { include: { assignedTo: true } }, users: true },
      });
  
      if (!project) {
        return res.status(404).json({ error: 'Proyecto no encontrado.' });
      }
  
      res.render('projects/dashboard', { project, currentRoute: '/projects' });
    } catch (error) {
      res.status(500).json({ error: 'Error al cargar el dashboard del proyecto.' });
    }
  });
  

module.exports = router;
