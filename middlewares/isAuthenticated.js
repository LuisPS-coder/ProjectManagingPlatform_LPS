function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  req.flash("error", "Debes iniciar sesión para acceder a esta página.");
  res.redirect("/auth/login-page");
}

module.exports = isAuthenticated;
