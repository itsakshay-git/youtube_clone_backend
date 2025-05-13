import jwt from "jsonwebtoken";

/**
 * Middleware to verify the JWT token in the request headers.
 * The token is expected to be in the Authorization header as a Bearer token.
 * If the token is valid, it decodes the token and attaches the decoded user data to the request object.
 * If the token is invalid or missing, an appropriate error response is sent.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {function} next - The next middleware function to call if the token is valid.
 * @returns {void}
 */

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

    // Verify the token using the JWT secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    // If token is valid, attach the decoded user information to the request object
    req.user = decoded;
    next();
  });
};
