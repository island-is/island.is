'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "defendant"
         SET "verdict_view_date" = NULL
         WHERE "id" = '39e7e17a-89a5-450b-817a-e67b24b38e02'`,
        { transaction },
      ),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
