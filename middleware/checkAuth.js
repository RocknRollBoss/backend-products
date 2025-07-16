import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma-client.js";
export const checkAuth = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (!token) {
      return res.status(401).json({ message: "Нет токена доступа" });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Неверный или просроченный токен",
    });
  }
};
