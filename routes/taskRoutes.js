const express = require('express');
const prisma = require('../config/prismaClient'); 
const isAuthenticated = require('../middlewares/isAuthenticated');

const router = express.Router();

// Obtener todas las tareas
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ include: { project: true, assignedTo: true } });
    res.render('tasks/index', { tasks, currentRoute: '/tasks' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// Formulario para crear una nueva tarea
router.get('/new', isAuthenticated, async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    const users = await prisma.user.findMany();
    res.render('tasks/new', { projects, users, currentRoute: '/tasks' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar el formulario de creación' });
  }
});

// Crear una nueva tarea
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, description, projectId, userId } = req.body;

    await prisma.task.create({
      data: {
        title,
        description,
        project: { connect: { id: projectId } },
        assignedTo: userId ? { connect: { id: userId } } : undefined,
      },
    });

    res.redirect('/tasks');
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// Formulario para editar una tarea
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { project: true, assignedTo: true },
    });
    const projects = await prisma.project.findMany();
    const users = await prisma.user.findMany();

    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.render('tasks/edit', { task, projects, users, currentRoute: '/tasks' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar el formulario de edición' });
  }
});

// Actualizar una tarea
router.post('/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, description, completed, projectId, userId } = req.body;

    await prisma.task.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        completed: completed === 'true',
        project: { connect: { id: projectId } },
        assignedTo: userId ? { connect: { id: userId } } : undefined,
      },
    });

    res.redirect('/tasks');
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// Eliminar una tarea
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

module.exports = router;
