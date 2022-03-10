'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_custody_provisions" ADD VALUE \'_97_3\';',
      )
    } catch (e) {
      if (e.message !== 'enum label "_97_3" already exists') {
        throw e
      }
    }

    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_custody_provisions" ADD VALUE \'_115_1\';',
      )
    } catch (e) {
      if (e.message !== 'enum label "_115_1" already exists') {
        throw e
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // no need to roll back
    return
  },
}
