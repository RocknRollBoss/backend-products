import prisma from "../prisma/prisma-client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const resigster = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Please fill in the required fields" });
    }
    const registeredUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (registeredUser) {
      return res.status(400).json({
        message: "Such user exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });
    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: "30d",
    });
    if (user) {
      res.status(201).json({ ...user, token });
    } else {
      return res.status(400).json({
        message: "Failed to register",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to register",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in the required fields" });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: "30d",
    });
    if (user && isPasswordCorrect) {
      res.status(201).json({ ...user, token });
    } else {
      res.status(400).json({
        message: "Failed to login",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to login",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({
      message: "Failed to login",
    });
  }
};
