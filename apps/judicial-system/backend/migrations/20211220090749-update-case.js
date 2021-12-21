'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    // replaceEnum does not support transactions
    return queryInterface.sequelize
      .query(
        `UPDATE "case" set session_arrangements = 'PROSECUTOR_PRESENT' WHERE session_arrangements = 'REMOTE_SESSION'`,
      )
      .then(() => {
        return replaceEnum({
          queryInterface,
          tableName: 'case',
          columnName: 'session_arrangements',
          newValues: [
            'ALL_PRESENT',
            'ALL_PRESENT_SPOKESPERSON',
            'PROSECUTOR_PRESENT',
          ],
          enumName: 'enum_case_session_arrangements',
        })
      })
  },

  down: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'session_arrangements',
      newValues: [
        'ALL_PRESENT',
        'ALL_PRESENT_SPOKESPERSON',
        'PROSECUTOR_PRESENT',
        'REMOTE_SESSION',
      ],
      enumName: 'enum_case_session_arrangements',
    })
  },
}
