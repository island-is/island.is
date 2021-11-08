'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: async (queryInterface) => {
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_custody_restrictions" ADD VALUE \'NECESSITIES\';',
      )
    } catch (e) {
      if (e.message !== 'enum label "NECESSITIES" already exists') {
        throw e
      }
    }

    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_custody_restrictions" ADD VALUE \'WORKBAN\';',
      )
    } catch (e) {
      if (e.message !== 'enum label "WORKBAN" already exists') {
        throw e
      }
    }

    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'requested_custody_restrictions',
      newValues: [
        'ISOLATION',
        'VISITAION',
        'COMMUNICATION',
        'MEDIA',
        'ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION',
        'ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT',
        'NECESSITIES',
        'WORKBAN',
      ],
      enumName: 'enum_case_custody_restrictions',
    })
  },

  down: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'requested_custody_restrictions',
      newValues: [
        'ISOLATION',
        'VISITAION',
        'COMMUNICATION',
        'MEDIA',
        'ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION',
        'ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT',
      ],
      enumName: 'enum_case_custody_restrictions',
    })
  },
}
