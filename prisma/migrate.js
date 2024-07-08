import { config } from "dotenv";
import { execSync } from "child_process";
import "../src/config.ts"; // load the env
config(); // Load environment variables from .env file
try {
    // Run Prisma Migrate Dev command
    execSync("npx prisma migrate dev", { stdio: "inherit" });
}
catch (error) {
    console.error("Error running Prisma Migrate command:", error);
    process.exit(1);
}
