'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
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
        'COMPLETED_WITHOUT_RULING', // new value - will be changed to string in future
      ],
      enumName: 'enum_case_decision',
    })
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
