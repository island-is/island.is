'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'state',
      defaultValue: 'NEW',
      newValues: ['NEW', 'DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED'],
      enumName: 'enum_case_state',
    })
  },

  down: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'state',
      defaultValue: 'DRAFT',
      newValues: ['DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED'],
      enumName: 'enum_case_state',
    })
  },
}
