'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: async (queryInterface) => {
    // Safely add the new enum value to the type without replacing the entire enum
    await queryInterface.sequelize.query(`
      ALTER TYPE enum_case_decision 
      ADD VALUE IF NOT EXISTS 'COMPLETED_WITHOUT_RULING';
    `)
  },

  down: (queryInterface) => {
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
}
