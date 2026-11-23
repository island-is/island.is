'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
       SET "field_settings" = "field_settings" || '{"showChildrenInCustody": false, "showBiologicalChildren": true}'::jsonb,
           "modified" = CURRENT_TIMESTAMP
       WHERE "field_type" = 'FAMILY'
         AND "field_settings"->>'familyType' = 'CHILD'`,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
       SET "field_settings" = "field_settings" - 'showChildrenInCustody' - 'showBiologicalChildren',
           "modified" = CURRENT_TIMESTAMP
       WHERE "field_type" = 'FAMILY'
         AND "field_settings"->>'familyType' = 'CHILD'`,
        { transaction },
      )
    })
  },
}
