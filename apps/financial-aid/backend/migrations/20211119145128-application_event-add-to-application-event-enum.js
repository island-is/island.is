'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return replaceEnum({
      queryInterface,
      tableName: 'application_events',
      columnName: 'event_type',
      defaultValue: 'New',
      newValues: [
        'SpouseFileUpload',
        'New',
        'InProgress',
        'DataNeeded',
        'Rejected',
        'Approved',
        'StaffComment',
        'UserComment',
        'FileUpload',
        'AssignCase',
      ],
      enumName: 'enum_application_events_event_type',
    })
  },

  down: async (queryInterface, Sequelize) => {
    // no need to roll back
    return
  },
}
