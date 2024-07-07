import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

if (!sequelize) {
  throw new Error("Sequelize instance is not available");
}
const Organisation = sequelize?.define(
  "Organisation",
  {
    orgId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    modelName: "Organisation",
    tableName: "organisations",
  },
);

export default Organisation;
