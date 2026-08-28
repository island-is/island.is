'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [result] = await queryInterface.sequelize.query(
      `SELECT 1 FROM pg_type WHERE typname = 'enum_case_state'`,
    )

    if (result.length === 0) {
      // State column was converted to STRING in 20240531113155-update-case.js
      return
    }

    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_case_state" ADD VALUE IF NOT EXISTS 'WAITING_FOR_REVIEW'`,
      )
    } catch (e) {
      if (e.message !== 'enum label "WAITING_FOR_REVIEW" already exists') {
        throw e
      }
    }
  },

  down: () => {
    // Postgres does not support removing enum values
    return Promise.resolve()
  },
}
