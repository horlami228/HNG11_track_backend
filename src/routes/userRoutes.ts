import {
  getUSer,
  allOrganisation,
  getOrg,
  createOrg,
  addToOrg,
} from "../controllers/userController.js";
import { Router } from "express";
import validate from "../middleware/validateMiddleware.js";
import Joi from "joi";
import { verifyToken } from "../middleware/guardMiddleware.js";

const router = Router();

// route to get user details

// define the joi schema for getUser
const getSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
router.get("/users/:id", verifyToken, validate(getSchema, "params"), getUSer);

// route to get all organisations
router.get("/organisations", verifyToken, allOrganisation);

// route to get a single organisation
const orgSchema = Joi.object({
  orgId: Joi.string().uuid().required(),
});

router.get(
  "/organisations/:orgId",
  verifyToken,
  validate(orgSchema, "params"),
  getOrg,
);

// route to create o rganisation
const createOrgSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

router.post(
  "/organisations",
  verifyToken,
  validate(createOrgSchema, "body"),
  createOrg,
);

// route to add a user to an organisation
const addOrgSchemaBody = Joi.object({
  userId: Joi.string().uuid().required(),
});
const addOrgSchemaParam = Joi.object({
  orgId: Joi.string().uuid().required(),
});

router.post(
  "/organisations/:orgId/users",
  verifyToken,
  validate(addOrgSchemaParam, "params"),
  validate(addOrgSchemaBody, "body"),
  addToOrg,
);

export default router;
