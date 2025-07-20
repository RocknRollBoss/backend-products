import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  clearCart,
  createCartItem,
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from "../controllers/cart.js";
const router = Router();
router.get("/", checkAuth, getCartItems);
router.post("/", checkAuth, createCartItem);
router.put("/", checkAuth, updateCartItem);
router.delete("/:productId", checkAuth, deleteCartItem);
router.delete("/", checkAuth, clearCart
    
);
export default router;
