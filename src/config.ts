// console.log("i am here");
import { config } from "dotenv";
if (process.env.NODE_ENV === "production") {
  config({ path: ".env.production" });
} else {
  config({ path: ".env.development" });
}
// Optional: Log to verify correct environment file is loaded
// console.log("Environment variables loaded:", {
//   DATABASE_URL: process.env.DATABASE_URL,
//   IP_INFO_TOKEN: process.env.IP_INFO_TOKEN,
// });
