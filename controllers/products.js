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
      message: "Ошибка при получении товаров",
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
        message: "Товар не найден",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: "Ошибка при получении товара",
    });
  }
};

export const create = async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body;
    if (!name || !price || !imageUrl) {
      return res.status(400).json({
        message: "Заполните обязательные поля",
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
      message: "Не удалось создать товар",
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
      message: "Товар удалился успешно",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить товар",
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
      message: "Товар обновлен успешно",
    });
  } catch (error) {
    res.status(500).json({
      message: "Не удалось обновить товар",
    });
  }
};
