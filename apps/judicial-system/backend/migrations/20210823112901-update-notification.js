'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface, Sequelize) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'notification',
      columnName: 'type',
      newValues: [
        'HEADS_UP',
        'READY_FOR_COURT',
        'RECEIVED_BY_COURT',
        'COURT_DATE',
        'RULING',
        'REVOKED',
      ],
      enumName: 'enum_notification_type',
    })
  },

  down: (queryInterface, Sequelize) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'notification',
      columnName: 'type',
      newValues: [
        'HEADS_UP',
        'READY_FOR_COURT',
        'COURT_DATE',
        'RULING',
        'REVOKED',
      ],
      enumName: 'enum_notification_type',
    })
  },
}
