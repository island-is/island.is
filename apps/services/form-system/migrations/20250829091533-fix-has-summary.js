'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Set default value to false for all existing rows
    await queryInterface.sequelize.query(
      `UPDATE "form" SET "has_summary_screen" = false WHERE "has_summary_screen" IS NULL`,
    )

    // 2. Change column to NOT NULL and set default value to false
    await queryInterface.changeColumn('form', 'has_summary_screen', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },

  async down(queryInterface, Sequelize) {
    // Revert column to nullable and remove default value
    await queryInterface.changeColumn('form', 'has_summary_screen', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    })
  },
}
