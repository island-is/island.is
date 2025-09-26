'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "subpoena"
         SET "police_subpoena_id" = '87cea909-690a-4057-9696-ba1cdf4e71f8'
         WHERE "id" = 'ea3c92eb-77a7-49d5-9c92-abbd68642b66'`,
        { transaction },
      ),
    )
  },
  down: () => {
    return Promise.resolve()
  },
}
