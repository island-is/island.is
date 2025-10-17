'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE "application" SET "status" = 'draft' WHERE "status" = 'IN_PROGRESS';`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `UPDATE "application" SET "status" = 'completed' WHERE "status" = 'SUBMITTED';`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `UPDATE "application" SET "status" = 'completed' WHERE "status" = 'PRUNED';`,
        { transaction },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    // Reverse the changes if possible
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE "application" SET "status" = 'IN_PROGRESS' WHERE "status" = 'draft';`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `UPDATE "application" SET "status" = 'SUBMITTED' WHERE "status" = 'completed';`,
        { transaction },
      )
    })
  },
}
