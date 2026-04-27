'use strict'

module.exports = {
  async up(queryInterface) {
    // ALTER TYPE ... ADD VALUE cannot run inside a transaction block
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_case_string_string_type" ADD VALUE IF NOT EXISTS 'REOPEN_REASON';`,
    )
  },

  async down() {
    // Postgres does not support removing enum values
  },
}
