'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'INVESTIGATION\'  ;',
      )
    } catch (e) {
      if (e.message != 'enum label "INVESTIGATION" already exists') {
        throw e
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // no need to roll back
    return
  },
}
