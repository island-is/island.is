'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "case"
         SET "state" = 'DRAFT'
         WHERE "id" = '8627c531-f4af-45a8-82c2-64a250780ad9'`,
        { transaction },
      ),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
