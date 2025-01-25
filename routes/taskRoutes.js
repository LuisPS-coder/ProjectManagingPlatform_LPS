const express = require('express');
const prisma = require('../config/prismaClient');
const isAuthenticated = require('../middlewares/isAuthenticated');

const router = express.Router();

// Obtener todas las tareas
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { project: true, assignedTo: true },
    });
    res.render('tasks/index', { tasks, currentRoute: '/tasks' });
  } catch (error) {
    console.error('Error al obtener las tareas:', error.message);
    res.status(500).json({ error: 'Error al obtener las tareas.' });
  }
});

module.exports = router;

