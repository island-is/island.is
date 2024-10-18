'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return replaceEnum({
      queryInterface,
      tableName: 'application_files',
      columnName: 'type',
      defaultValue: 'Other',
      newValues: [
        'Income',
        'TaxReturn',
        'Other',
        'SpouseFiles',
        'ChildrenFiles',
      ],
      enumName: 'enum_application_files_type',
    })
  },

  down: async (queryInterface, Sequelize) => {
    // no need to roll back
    return
  },
}
