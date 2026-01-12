'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .transaction(async (transaction) => {
        await queryInterface.addColumn(
          'case',
          'is_completed_without_ruling',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction },
        )

        await queryInterface.sequelize.query(
          `UPDATE "case"
         SET "is_completed_without_ruling" = TRUE,
             "decision" = 'ACCEPTING'
         WHERE "decision" = 'COMPLETED_WITHOUT_RULING'`,
          { transaction },
        )
      })
      .then(() => {
        // replaceEnum does not support transactions
        return replaceEnum({
          queryInterface,
          tableName: 'case',
          columnName: 'decision',
          newValues: [
            'ACCEPTING',
            'REJECTING',
            'ACCEPTING_ALTERNATIVE_TRAVEL_BAN',
            'ACCEPTING_PARTIALLY',
            'DISMISSING',
          ],
          enumName: 'enum_case_decision',
        })
      })
  },

  async down(queryInterface) {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'decision',
      newValues: [
        'ACCEPTING',
        'REJECTING',
        'ACCEPTING_ALTERNATIVE_TRAVEL_BAN',
        'ACCEPTING_PARTIALLY',
        'DISMISSING',
        'COMPLETED_WITHOUT_RULING',
      ],
      enumName: 'enum_case_decision',
    }).then(() =>
      queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `UPDATE "case"
           SET "decision" = 'COMPLETED_WITHOUT_RULING'
           WHERE "decision" = 'ACCEPTING' AND "is_completed_without_ruling" = TRUE`,
          { transaction },
        )

        await queryInterface.removeColumn(
          'case',
          'is_completed_without_ruling',
          { transaction },
        )
      }),
    )
  },
}
