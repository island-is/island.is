'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  async up(queryInterface) {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'request_shared_with_defender',
      newValues: ['READY_FOR_COURT', 'COURT_DATE', 'NOT_SHARED'],
      enumName: 'enum_case_request_shared_with_defender',
    })
  },

  async down(queryInterface) {
    // replaceEnum does not support transactions
    return queryInterface.sequelize
      .transaction((transaction) =>
        queryInterface.bulkUpdate(
          'case',
          { request_shared_with_defender: null },
          {
            request_shared_with_defender: 'NOT_SHARED',
          },
          { transaction },
        ),
      )
      .then(() =>
        replaceEnum({
          queryInterface,
          tableName: 'case',
          columnName: 'request_shared_with_defender',
          newValues: ['READY_FOR_COURT', 'COURT_DATE'],
          enumName: 'enum_case_request_shared_with_defender',
        }),
      )
  },
}
