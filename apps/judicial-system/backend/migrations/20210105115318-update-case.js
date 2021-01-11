'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_custody_provisions" ADD VALUE \'_100_1\';',
      )
    } catch (e) {
      if (e.message != 'enum label "_100_1" already exists') {
        throw e
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // no need to roll back
    return
  },
}
