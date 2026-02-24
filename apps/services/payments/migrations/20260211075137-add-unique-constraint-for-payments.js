'use strict'

/** Partial unique indexes: only one row per payment_flow_id can have is_deleted = false (active). */
const PAYMENT_FULFILLMENT_INDEX =
  'payment_fulfillment_one_active_per_payment_flow_id'
const CARD_PAYMENT_DETAILS_INDEX =
  'card_payment_details_one_active_per_payment_flow_id'

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX "${PAYMENT_FULFILLMENT_INDEX}" ON "payment_fulfillment" (payment_flow_id) WHERE (is_deleted = false)`,
        { transaction: t },
      )
      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX "${CARD_PAYMENT_DETAILS_INDEX}" ON "card_payment_details" (payment_flow_id) WHERE (is_deleted = false)`,
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS "${PAYMENT_FULFILLMENT_INDEX}"`,
        { transaction: t },
      )
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS "${CARD_PAYMENT_DETAILS_INDEX}"`,
        { transaction: t },
      )
    })
  },
}
