export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const expectedToken = Buffer.from(`admin:${process.env.ADMIN_PASSWORD}`).toString('base64');
  
  if (token === expectedToken) {
    next();
  } else {
    return res.status(403).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
