import { greeting } from "../controllers/greetings.js";
import { Router } from "express";

const router = Router();

router.get("/hello", greeting);

export default router;
