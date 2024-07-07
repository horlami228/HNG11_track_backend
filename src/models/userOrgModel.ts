import { DataTypes } from "sequelize";
import User from "./userModel.js";
import Organisation from "./orgModel.js";
import sequelize from "../db/index.js";

if (!sequelize) {
  throw new Error("Sequelize instance is not available");
}

const UserOrganisation = sequelize.define(
  "user_organisations",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    orgId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Organisation,
        key: "userId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: true,
    modelName: "UserOrganisation",
    tableName: "user_organisations",
  },
);

User.belongsToMany(Organisation, {
  through: UserOrganisation,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Organisation.belongsToMany(User, {
  through: UserOrganisation,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
export default UserOrganisation;
