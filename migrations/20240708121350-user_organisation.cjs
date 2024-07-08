"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Create the user_organisations table
      await queryInterface.createTable(
        "user_organisations",
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4,
          },
          userId: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            references: {
              model: "users",
              key: "userId",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          orgId: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            references: {
              model: "organisations",
              key: "orgId",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Drop the user_organisations table
      await queryInterface.dropTable("user_organisations", { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
