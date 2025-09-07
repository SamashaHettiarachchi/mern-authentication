import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  // Try to read token from cookies, Authorization header, or request body
  const cookieToken = req.cookies && req.cookies.token;
  const authHeader = req.headers && req.headers.authorization;
  const headerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : undefined;
  const bodyToken = req.body && req.body.token;

  const token = cookieToken || headerToken || bodyToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    if (decoded && decoded.id) {
      req.body.userId = decoded.id;
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default userAuth;
