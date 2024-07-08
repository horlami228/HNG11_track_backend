import { newUser, login } from "../controllers/userController.js";
import { Router } from "express";
import validate from "../middleware/validateMiddleware.js";
import Joi from "joi";
import { verifyToken } from "../middleware/guardMiddleware.js";
const router = Router();
// Define Joi schema for validating a new user creation
const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
});
// route to create a new user
router.post("/register", validate(createUserSchema, "body"), newUser);
// Define joi schema for login input
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
// route to login a user
router.post("/login", validate(loginSchema, "body"), login);

export default router;
