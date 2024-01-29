'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'appeal_ruling_decision',
      newValues: [
        'ACCEPTING',
        'CHANGED',
        'CHANGED_SIGNIFICANTLY',
        'DISMISSED_FROM_COURT',
        'DISMISSED_FROM_COURT_OF_APPEAL',
        'REMAND',
        'REPEAL',
        'WITHDRAWN', // New value
      ],
      enumName: 'enum_case_appeal_ruling_decision',
    })
  },

  down: (queryInterface) => {
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'appeal_ruling_decision',
      newValues: [
        'ACCEPTING',
        'CHANGED',
        'CHANGED_SIGNIFICANTLY',
        'DISMISSED_FROM_COURT',
        'DISMISSED_FROM_COURT_OF_APPEAL',
        'REMAND',
        'REPEAL',
      ],
      enumName: 'enum_case_appeal_ruling_decision',
    })
  },
}
