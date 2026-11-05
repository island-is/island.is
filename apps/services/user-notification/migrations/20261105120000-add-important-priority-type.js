'use strict'

// Postgres cannot add enum values inside a transaction block on older
// versions, so this migration deliberately runs without one.
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_user_notification_priority_type" ADD VALUE IF NOT EXISTS 'Important';`,
    )
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_user_notification_sender_priority_type" ADD VALUE IF NOT EXISTS 'Important';`,
    )
  },

  async down() {
    // Postgres does not support removing a value from an enum type.
  },
}
