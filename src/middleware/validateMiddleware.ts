import joi, { Schema } from "joi";
import { Request, Response, NextFunction } from "express";

// Define a type for joi schema
type JoiSchema = Schema;

const validate = (schema: JoiSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      // return res.status(422).json({ error: error.details[0].message });
      return res.status(422).json({
        errors: [
          {
            fields: error.details[0].path[0],
            message: error.details[0].message,
          },
        ],
      });
    }
    req.body = value; // Use the validated value
    next();
  };
};

export default validate;
