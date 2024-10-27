const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate' });
    req.userId = decoded.id;
    next();
  });
};
