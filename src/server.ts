import express from "express";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";

// Load the correct .env file based on NODE_ENV
if (process.env.NODE_ENV === "production") {
  config({ path: ".env.production" });
} else {
  config({ path: ".env.development" });
}
const PORT = process.env.PORT || 8000;
// set default port or use provided PORT env variable

//inititialize a new Express app
const app = express();

//Enable express to parse JSON data
app.use(express.json());

// 404 error handler middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("404 Page Not Found");
  next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Opps something went wrong! Please try again later");
});

// start the server
console.log(`The environment is ${process.env.NODE_ENV}`);

// Listends for request on the specified PORT
app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
