import prisma from "../prisma/prisma-client.js";

export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: "Error receiving cartItems",
    });
  }
};

export const createCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: { quantity: existing.quantity + quantity },
      });
      return res.json(updated);
    }

    const newItem = await prisma.cartItem.create({
      data: { userId, productId, quantity },
    });

    res.status(200).json(newItem);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create prodcut",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const updatedItem = await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cartItem",
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const cartItem = await prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return res.status(200).json({
      message: "Clear cart was succes",
    });
  } catch (err) {
    console.error("Error to clear cart:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
