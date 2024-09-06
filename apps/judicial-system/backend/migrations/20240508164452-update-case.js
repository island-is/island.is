'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  async up(queryInterface) {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'state',
      defaultValue: 'NEW',
      newValues: [
        'NEW',
        'DRAFT',
        'WAITING_FOR_CONFIRMATION',
        'SUBMITTED',
        'RECEIVED',
        'MAIN_HEARING',
        'ACCEPTED',
        'REJECTED',
        'DISMISSED',
        'COMPLETED', //new value
        'DELETED',
      ],
      enumName: 'enum_case_state',
    }).then(() =>
      queryInterface.sequelize.transaction((transaction) =>
        queryInterface.bulkUpdate(
          'case',
          { state: 'COMPLETED' },
          { type: 'INDICTMENT', state: 'ACCEPTED' },
          { transaction },
        ),
      ),
    )
  },

  async down(queryInterface) {
    // replaceEnum does not support transactions
    return queryInterface.sequelize
      .transaction((transaction) =>
        queryInterface.bulkUpdate(
          'case',
          { state: 'ACCEPTED' },
          { type: 'INDICTMENT', state: 'COMPLETED' },
          { transaction },
        ),
      )
      .then(() =>
        replaceEnum({
          queryInterface,
          tableName: 'case',
          columnName: 'state',
          defaultValue: 'NEW',
          newValues: [
            'NEW',
            'DRAFT',
            'WAITING_FOR_CONFIRMATION',
            'SUBMITTED',
            'RECEIVED',
            'MAIN_HEARING',
            'ACCEPTED',
            'REJECTED',
            'DISMISSED',
            'DELETED',
          ],
          enumName: 'enum_case_state',
        }),
      )
  },
}
