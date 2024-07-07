import { Sequelize, Dialect, Options } from "sequelize";
import dbConfig, { AppConfig, DatabaseConfig } from "./config.js";

const env: keyof AppConfig =
  (process.env.NODE_ENV as keyof AppConfig) || "development";

let sequelize: Sequelize | null = null;

try {
  const config: AppConfig = dbConfig;
  const sequelizeConfig: DatabaseConfig = config[env];

  const sequelizeOptions: Options = {
    dialect: sequelizeConfig.dialect as Dialect,
    logging: sequelizeConfig.logging,
    define: sequelizeConfig.define,
    pool: sequelizeConfig.pool ? sequelizeConfig.pool : undefined, // Ensure pool is handled correctly
  };

  // Only include dialectOptions for production
  if (env === "production" && sequelizeConfig.dialectOptions) {
    sequelizeOptions.dialectOptions = sequelizeConfig.dialectOptions;
  }

  sequelize = new Sequelize(sequelizeConfig.url, sequelizeOptions);
} catch (error) {
  console.error("Error initializing Sequlize", error);
}

export default sequelize;
