'use strict'

// NOTE: `ALTER TYPE ... ADD VALUE` cannot run inside a transaction block, so this
// migration intentionally does not wrap the statement in queryInterface.sequelize.transaction.
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_payment_fulfillment_payment_method" ADD VALUE IF NOT EXISTS 'bank_transfer'`,
    )
  },

  async down() {
    console.warn(
      'WARNING: Rolling back enum additions is not supported. ' +
        'The new enum value will remain in the database.',
    )
  },
}
