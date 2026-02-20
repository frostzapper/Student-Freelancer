const checkRole = (role) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    // Allow if user has the exact role or 'both'
    if (userRole !== role && userRole !== 'both') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    next();
  };
};

module.exports = checkRole;
