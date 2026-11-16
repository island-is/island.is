'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
       SET "field_settings" = jsonb_set(
         COALESCE("field_settings", '{}'::jsonb),
         '{fetchBankAccountFromMyPages}',
         'true'::jsonb,
         true
       ),
       "modified" = CURRENT_TIMESTAMP
       WHERE "field_type" = 'BANK_ACCOUNT'`,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
       SET "field_settings" = (COALESCE("field_settings", '{}'::jsonb) - 'fetchBankAccountFromMyPages'),
           "modified" = CURRENT_TIMESTAMP
       WHERE "field_type" = 'BANK_ACCOUNT'`,
        { transaction },
      )
    })
  },
}
