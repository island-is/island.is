'use strict'

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
  },

  down: async () => {
    // no need to roll back
    return
  },
}
