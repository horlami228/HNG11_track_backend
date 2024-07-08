import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";
import Organisation from "./orgModel.js";
import UserOrganisation from "./userOrgModel.js";

if (!sequelize) {
  throw new Error("Sequelize instance is not available");
}
const User = sequelize.define(
  "users",
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default User;
