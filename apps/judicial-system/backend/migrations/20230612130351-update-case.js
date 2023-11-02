'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'session_arrangements',
      newValues: [
        'ALL_PRESENT',
        'ALL_PRESENT_SPOKESPERSON',
        'PROSECUTOR_PRESENT',
        'NONE_PRESENT',
      ],
      enumName: 'enum_case_session_arrangements',
    })
  },

  down: (queryInterface) => {
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'session_arrangements',
      newValues: ['ALL_PRESENT', 'PROSECUTOR_PRESENT', 'REMOTE_SESSION'],
      enumName: 'enum_case_session_arrangements',
    })
  },
}
