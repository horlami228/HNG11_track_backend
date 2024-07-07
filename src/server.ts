import "./config.js"; // load the env
import express from "express";
import { Request, Response, NextFunction } from "express";
import greetingRoute from "./routes/greetingRoute.js";
import userRoutes from "./routes/userRoutes.js";
// import prisma from "./config/prismaClient.js";
import sequelize from "./db/index.js";
import User from "./models/userModel.js";
import Organisation from "./models/orgModel.js";
import errorHandlingMiddleware from "./middleware/errorHandler.js";
// Load the correct .env file based on NODE_ENV
// console.log("db_url", process.env.DATABASE_URL);
const PORT = process.env.PORT || 8000;
// set default port or use provided PORT env variable

//inititialize a new Express app
const app = express();

//Enable express to parse JSON data
app.use(express.json());

// Test the database connection
// try {
//   await prisma.$connect();
//   console.log("Connected to the database successfully");
// } catch (error: any) {
//   console.error("Could not connect to the database");
//   console.error(error.message);
// } finally {
//   await prisma.$disconnect();
// }
// Test the db connection
sequelize
  ?.authenticate()
  .then(() => {
    console.log("Database Conncetion has been established succesfully,");
  })
  .catch((error) => {
    console.error("Unable to connect to the database", error);
  });

// sysc db in development
// if (process.env.NODE_ENV === "development") {
//   sequelize
//     ?.sync({ force: true }) // Use force: true to drop existing tables (careful in production)
//     .then(() => {
//       console.log("Database synced");
//       // Start your application
//     })
//     .catch((err) => console.error("Error syncing database:", err));
// }
// Api endpoints here
app.use("/api/", greetingRoute);

app.use("/auth", userRoutes);

// 404 error handler middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("404 Page Not Found");
  next();
});

// use the error handler middleware here
app.use(errorHandlingMiddleware);

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
