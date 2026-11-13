'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
       SET "field_settings" = "field_settings" - 'notIncludedInSumbox',
           "modified" = CURRENT_TIMESTAMP
       WHERE "field_type" = 'ISK_NUMBERBOX'
         AND "field_settings" ? 'notIncludedInSumbox'`,
        { transaction },
      )
    })
  },

  async down() {},
}
