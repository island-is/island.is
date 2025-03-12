'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.sequelize.query(
          `UPDATE "case"
           SET "ruling_date" = '2025-01-31',
               "court_end_time" = '2025-01-31'
           WHERE "id" = 'a0288e8e-3784-4ed0-9f61-017cef6057a1'`,
          { transaction },
        ),
        queryInterface.sequelize.query(
          `UPDATE "case"
           SET "ruling_date" = '2025-01-30',
               "court_end_time" = '2025-01-30'
           WHERE "id" IN (
             '08e333ce-a372-4399-a436-9aae31471186',
             '20793bf2-943e-4c73-8846-73c1988bbe35',
             '9a05e90d-0823-4acc-99db-42a16c774d9a'
           )`,
          { transaction },
        ),
      ]),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
