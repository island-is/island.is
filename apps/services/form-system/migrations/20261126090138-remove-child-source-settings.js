'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
         SET "field_settings" = "field_settings" - 'showBiologicalChildren' - 'showChildrenInCustody',
             "modified" = CURRENT_TIMESTAMP
         WHERE "field_settings" ?| ARRAY['showBiologicalChildren', 'showChildrenInCustody']`,
        { transaction },
      )
    })
  },

  async down() {
    // Removed per-field choices cannot be reconstructed.
  },
}
