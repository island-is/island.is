'use strict'

module.exports = {
  async up(queryInterface /*, Sequelize */) {
    return queryInterface.sequelize.transaction(async (t) => {
      // field.field_settings -> JSONB
      await queryInterface.sequelize.query(
        `ALTER TABLE "field"
         ALTER COLUMN "field_settings"
         TYPE JSONB
         USING "field_settings"::jsonb`,
        { transaction: t },
      )

      // value.json -> JSONB
      await queryInterface.sequelize.query(
        `ALTER TABLE "value"
         ALTER COLUMN "json"
         TYPE JSONB
         USING "json"::jsonb`,
        { transaction: t },
      )
    })
  },

  async down(queryInterface /*, Sequelize */) {
    return queryInterface.sequelize.transaction(async (t) => {
      // Revert field.field_settings back to JSON
      await queryInterface.sequelize.query(
        `ALTER TABLE "field"
         ALTER COLUMN "field_settings"
         TYPE JSON
         USING "field_settings"::json`,
        { transaction: t },
      )

      // Revert value.json back to JSON
      await queryInterface.sequelize.query(
        `ALTER TABLE "value"
         ALTER COLUMN "json"
         TYPE JSON
         USING "json"::json`,
        { transaction: t },
      )
    })
  },
}
