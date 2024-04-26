'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'state',
      defaultValue: 'NEW',
      newValues: [
        'NEW',
        'DRAFT',
        'WAITING_FOR_CONFIRMATION', // NEW VALUE
        'SUBMITTED',
        'RECEIVED',
        'ACCEPTED',
        'REJECTED',
        'DELETED',
        'DISMISSED',
      ],
      enumName: 'enum_case_state',
    })
  },

  down: (queryInterface) => {
    return replaceEnum({
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
        'DISMISSED',
      ],
      enumName: 'enum_case_state',
    })
  },
}
