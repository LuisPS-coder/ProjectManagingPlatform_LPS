function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }

  res.status(403).send('Acceso denegado. No tienes permisos de administrador.');
}

module.exports = isAdmin;

