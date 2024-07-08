import "../config.js";

export interface DatabaseConfig {
  url: string;
  dialect: string; // Or use specific types like 'mysql' | 'postgres' | 'sqlite'
  protocol?: string;
  logging?: boolean;
  define?: {
    timestamps: boolean;
  };
  dialectOptions?: {
    ssl: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
  charset?: string;
}

export interface AppConfig {
  development: DatabaseConfig;
  production: DatabaseConfig;
}

const dbConfig: AppConfig = {
  development: {
    url: process.env.DATABASE_URL || "", // Full connection URI
    dialect: process.env.DEV_DB_DIALECT || "", // Or another dialect according to your DB
    protocol: process.env.DEV_DB_PROTOCOL, // Database protocol
    logging: false,
    define: {
      timestamps: true,
    },
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    charset: "utf8mb4",
  },
  production: {
    url: process.env.DATABASE_URL || "", // Full connection URI
    dialect: process.env.DB_DIALECT || "", // Or another dialect according to your DB
    protocol: process.env.DB_PROTOCOL, // Database protocol
    logging: true,
    define: {
      timestamps: true,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 30,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    charset: "utf8mb4",
  },
};

export default dbConfig;
