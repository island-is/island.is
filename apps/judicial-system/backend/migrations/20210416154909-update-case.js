'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query(
        `ALTER TABLE "case" ALTER COLUMN "type" DROP DEFAULT;`,
        { transaction: t },
      ),
    )
  },

  down: async (queryInterface, Sequelize) => {
    // No need to roll back
    return
  },
}
