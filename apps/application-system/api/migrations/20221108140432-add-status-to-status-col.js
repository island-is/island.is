'use strict'

module.exports = {
  up: async (queryInterface) => {
    try {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_application_status" ADD VALUE \'draft\';',
      )
    } catch (e) {
      if (e.message != 'enum label "draft" already exists') {
        throw e
      }
    }

    try {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_application_status" ADD VALUE \'approved\';',
      )
    } catch (e) {
      if (e.message != 'enum label "approved" already exists') {
        throw e
      }
    }
  },

  down: async () => {
    // no need to roll back
    return
  },
}
