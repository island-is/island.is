'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) => {
      return queryInterface.sequelize.query(
        `UPDATE "case" SET state = 'DRAFT' WHERE state = 'UNKNOWN' or state = 'ACTIVE' or state = 'COMPLETED';`,
        { transaction: t },
      )
    })
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) => {
      return queryInterface.sequelize.query(
        `UPDATE "case" SET state = 'DRAFT' WHERE state = 'ACCEPTED' or state = 'REJECTED';`,
        { transaction: t },
      )
    })
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'state',
      defaultValue: 'DRAFT',
      newValues: ['UNKNOWN', 'DRAFT', 'SUBMITTED', 'ACTIVE', 'COMPLETED'],
      enumName: 'enum_case_state',
    })
  },
}
