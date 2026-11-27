'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
         SET "is_part_of_multiset" = FALSE,
             "modified" = CURRENT_TIMESTAMP
         WHERE "field_type" = 'FAMILY'
           AND "field_settings"->>'familyType' = 'CHILD'
           AND "is_part_of_multiset" IS DISTINCT FROM FALSE`,
        { transaction },
      )
    })
  },

  async down() {
    // Previous multiset membership cannot be reconstructed.
  },
}
