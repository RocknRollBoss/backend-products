import { Router } from "express";
import {
  create,
  edit,
  getAll,
  getOne,
  remove,
} from "../controllers/products.js";
import { checkAuth } from "../middleware/checkAuth.js";
const router = Router();
router.get("/", getAll);
router.get("/:id", checkAuth, getOne);
router.post("/create", checkAuth, create);
router.delete("/:id", checkAuth, remove);
router.put("/:id", checkAuth, edit);

export default router;
