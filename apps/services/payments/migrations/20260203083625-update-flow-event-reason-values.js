'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_payment_flow_event_reason" ADD VALUE IF NOT EXISTS 'payment_finalized'`,
    )

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_payment_flow_event_reason" ADD VALUE IF NOT EXISTS 'refund_started'`,
    )

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_payment_flow_event_reason" ADD VALUE IF NOT EXISTS 'refund_completed'`,
    )

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_payment_flow_event_reason" ADD VALUE IF NOT EXISTS 'refund_failed'`,
    )
  },

  async down() {
    console.warn(
      'WARNING: Rolling back enum additions is not supported. ' +
        'The new enum values will remain in the database.',
    )
  },
}
