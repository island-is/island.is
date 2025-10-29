'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        // Ruling date null but court end date exists
        // case ids confirmed after version 38.3
        queryInterface.sequelize.query(
          `UPDATE "case"
            SET "ruling_date" = "court_end_time"
            WHERE "id" IN (
            'b5a436c8-02a6-4710-a16e-d99706ca69de', 
            'af675297-a6f1-401a-8dd3-47730713afe6',
            '1823dd0f-80ba-4605-9ea5-e35aaaecd166',
            'bd04acc1-eac7-43b3-977e-5696c2e5a994'
            )`,
          { transaction },
        ),
        // Ruling date null and court end date null. We can view in the logs when the case was accepted.
        queryInterface.sequelize.query(
          `UPDATE "case"
            SET "ruling_date" = '2025-10-16 13:37:00',
                "court_end_time" = '2025-10-16 13:37:00'
            WHERE "id" = 'd8fec376-3f46-415b-8768-ef1997e2c344'`,
          { transaction },
        ),
      ]),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
