const express = require('express');
const router = express.Router();
const prisma = require('../config/prismaClient');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Ruta principal: muestra los proyectos en función del rol del usuario
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let projects;
    if (role === 'ADMIN') {
      projects = await prisma.project.findMany({ include: { users: true, tasks: true } });
    } else {
      projects = await prisma.project.findMany({
        where: { users: { some: { id: userId } } },
        include: { users: true, tasks: true },
      });
    }

    res.render('homepage', { projects, role, currentRoute: '/' });
  } catch (error) {
    console.error('Error al cargar la página principal:', error.message);
    res.status(500).json({ error: 'Error al cargar la página principal.' });
  }
});

module.exports = router;
