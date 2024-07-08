import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";
import User from "./userModel.js";
import Organisation from "./orgModel.js";

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
        key: "orgId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: true,
  },
);

User.belongsToMany(Organisation, {
  through: UserOrganisation,
  foreignKey: "userId",
  otherKey: "orgId",
  as: "organisations",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Organisation.belongsToMany(User, {
  through: UserOrganisation,
  foreignKey: "orgId",
  otherKey: "userId",
  as: "users",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
export default UserOrganisation;
