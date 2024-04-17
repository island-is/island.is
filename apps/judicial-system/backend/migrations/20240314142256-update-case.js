'use strict'

module.exports = {
  up: async (queryInterface) => {
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_legal_provisions" ADD VALUE \'_97_1\';',
      )
    } catch (e) {
      if (e.message !== 'enum label "_97_1" already exists') {
        throw e
      }
    }
  },

  down: async () => {
    // no need to roll back
    return
  },
}
