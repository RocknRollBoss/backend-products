import prisma from "../prisma/prisma-client.js";

export const getAll = async (req, res) => {
  const searchQuery = req.query.search || "";
  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: searchQuery,
        },
      },
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error receiving products",
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: "Product not found",
    });
  }
};

export const create = async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body;
    if (!name || !price || !imageUrl) {
      return res.status(400).json({
        message: "Please fill in the required fields",
      });
    }
    const product = await prisma.product.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });
    return res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Unable to create product",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await prisma.product.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({
      message: "Product create success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete item",
    });
  }
};

export const edit = async (req, res) => {
  try {
    const { id } = req.body;
    await prisma.product.update({
      where: {
        id,
      },
      data: req.body,
    });
    res.status(200).json({
      message: "Product update product ",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
    });
  }
};
