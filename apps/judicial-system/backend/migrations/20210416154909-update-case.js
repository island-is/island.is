'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query(
        `ALTER TABLE "case" ALTER COLUMN "type" DROP DEFAULT;`,
        { transaction: t },
      ),
    )
  },

  down: async () => {
    // No need to roll back
    return
  },
}
