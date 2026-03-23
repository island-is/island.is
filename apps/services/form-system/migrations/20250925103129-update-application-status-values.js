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
        `UPDATE "application" SET "status" = 'completed', "pruned" = TRUE WHERE "status" = 'PRUNED';`,
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

      // Completed applications that were previously PRUNED
      await queryInterface.sequelize.query(
        `UPDATE "application" SET "status" = 'PRUNED' WHERE "status" = 'completed' AND "pruned" = TRUE;`,
        { transaction },
      )
      // Remaining completed back to SUBMITTED
      await queryInterface.sequelize.query(
        `UPDATE "application" SET "status" = 'SUBMITTED' WHERE "status" = 'completed' AND ("pruned" = FALSE OR "pruned" IS NULL);`,
        { transaction },
      )
    })
  },
}
