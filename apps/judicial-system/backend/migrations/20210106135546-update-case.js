'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // replaceEnum does not support transactions
    await replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'state',
      defaultValue: 'NEW',
      newValues: [
        'NEW',
        'DRAFT',
        'SUBMITTED',
        'RECEIVED',
        'ACCEPTED',
        'REJECTED',
        'DELETED',
      ],
      enumName: 'enum_case_state',
    })

    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query(
        `UPDATE "case" SET "state" = 'RECEIVED' WHERE "state" = 'SUBMITTED';`,
        { transaction: t },
      ),
    )
  },

  down: async (queryInterface, Sequelize) => {
    // replaceEnum does not support transactions
    await queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query(
        `UPDATE "case" SET "state" = 'SUBMITTED' WHERE "state" = 'RECEIVED';`,
        { transaction: t },
      ),
    )

    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'state',
      defaultValue: 'NEW',
      newValues: [
        'NEW',
        'DRAFT',
        'SUBMITTED',
        'ACCEPTED',
        'REJECTED',
        'DELETED',
      ],
      enumName: 'enum_case_state',
    })
  },
}
