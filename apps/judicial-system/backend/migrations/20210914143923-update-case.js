'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_state" ADD VALUE \'DISMISSED\';',
      )
    } catch (e) {
      if (e.message !== 'enum label "DISMISSED" already exists') {
        throw e
      }
    }

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
  },

  down: (queryInterface, Sequelize) => {
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
      ],
      enumName: 'enum_case_decision',
    })
  },
}
