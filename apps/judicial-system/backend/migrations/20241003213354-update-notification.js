'use strict'
const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
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
        'MODIFIED',
        'REVOKED',
        'DEFENDER_ASSIGNED',
        'ADVOCATE_ASSIGNED', // Changed value
        'DEFENDANTS_NOT_UPDATED_AT_COURT',
        'APPEAL_TO_COURT_OF_APPEALS',
        'APPEAL_RECEIVED_BY_COURT',
        'APPEAL_STATEMENT',
        'APPEAL_COMPLETED',
        'APPEAL_JUDGES_ASSIGNED',
        'APPEAL_CASE_FILES_UPDATED',
        'APPEAL_WITHDRAWN',
        'INDICTMENT_DENIED',
        'INDICTMENT_RETURNED',
        'INDICTMENTS_WAITING_FOR_CONFIRMATION',
      ],
      enumName: 'enum_notification_type',
    })
  },

  down: (queryInterface) => {
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
        'MODIFIED',
        'REVOKED',
        'DEFENDER_ASSIGNED',
        'DEFENDANTS_NOT_UPDATED_AT_COURT',
        'APPEAL_TO_COURT_OF_APPEALS',
        'APPEAL_RECEIVED_BY_COURT',
        'APPEAL_STATEMENT',
        'APPEAL_COMPLETED',
        'APPEAL_JUDGES_ASSIGNED',
        'APPEAL_CASE_FILES_UPDATED',
        'APPEAL_WITHDRAWN',
        'INDICTMENT_DENIED',
        'INDICTMENT_RETURNED',
        'INDICTMENTS_WAITING_FOR_CONFIRMATION',
      ],
      enumName: 'enum_notification_type',
    })
  },
}
