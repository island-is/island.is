'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        "ALTER TYPE enum_applications_home_circumstances ADD VALUE 'UnregisteredLease';",
      )
    } catch (e) {
      if (e.message !== 'enum label "UnregisteredLease" already exists') {
        throw e
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // no need to roll back
    return
  },
}
