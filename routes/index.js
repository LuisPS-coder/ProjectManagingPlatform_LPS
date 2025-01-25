const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middlewares/isAuthenticated');
const isAdmin = require('../middlewares/isAdmin');

router.use('/auth', require('./auth'));
router.use('/admin', isAdmin, require('./admin'));

router.get('/profile', isAuthenticated, (req, res) => {
  const { email, role } = req.user;

  res.render('profile', { email, role });
});

router.get('/', isAuthenticated, (req, res) => {
  res.render('index', { title: 'Express project template', user: req.user });
});

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const role = req.user.role;

    let projects;
    if (role === 'ADMIN') {
      // Si es ADMIN, muestra todos los proyectos
      projects = await prisma.project.findMany({ include: { users: true, tasks: true } });
    } else {
      // Si es USER, muestra solo los proyectos asociados
      projects = await prisma.project.findMany({
        where: { users: { some: { id: userId } } },
        include: { users: true, tasks: true },
      });
    }

    res.render('homepage', { projects, role, currentRoute: '/' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar la página principal.' });
  }
});

module.exports = router;
