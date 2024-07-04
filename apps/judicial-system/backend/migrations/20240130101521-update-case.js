'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'appeal_state',
      newValues: [
        'APPEALED',
        'RECEIVED',
        'COMPLETED',
        'WITHDRAWN', // New value
      ],
      enumName: 'enum_case_appeal_state',
    })
  },

  down: (queryInterface) => {
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'appeal_state',
      newValues: ['APPEALED', 'RECEIVED', 'COMPLETED'],
      enumName: 'enum_case_appeal_state',
    })
  },
}
