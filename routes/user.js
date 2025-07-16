import { Router } from "express";
import { resigster, login, getMe } from "../controllers/user.js";
import { checkAuth } from "../middleware/checkAuth.js";
const router = Router();

router.post("/register", resigster);
router.post("/login", login);
router.get("/me", checkAuth, getMe);
export default router;
