'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(
        `UPDATE "case" SET state = 'DRAFT' WHERE state = 'UNKNOWN' or state = 'ACTIVE' or state = 'COMPLETED';`,
      )
      .then(() =>
        replaceEnum({
          queryInterface,
          tableName: 'case',
          columnName: 'state',
          defaultValue: 'DRAFT',
          newValues: ['DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED'],
          enumName: 'enum_case_state',
        }),
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(
        `UPDATE "case" SET state = 'DRAFT' WHERE state = 'ACCEPTED' or state = 'REJECTED';`,
      )
      .then(() =>
        replaceEnum({
          queryInterface,
          tableName: 'case',
          columnName: 'state',
          defaultValue: 'DRAFT',
          newValues: ['UNKNOWN', 'DRAFT', 'SUBMITTED', 'ACTIVE', 'COMPLETED'],
          enumName: 'enum_case_state',
        }),
      )
  },
}
