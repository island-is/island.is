'use strict';

/** Partial unique index: only one row per payment_flow_id can have is_deleted = false (active). */

const FJS_CHARGE_INDEX = 'fjs_charge_one_active_per_payment_flow_id'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX "${FJS_CHARGE_INDEX}" ON "fjs_charge" (payment_flow_id) WHERE (is_deleted = false)`,
        { transaction: t },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS "${FJS_CHARGE_INDEX}"`,
        { transaction: t },
      )
    })
  },
};
