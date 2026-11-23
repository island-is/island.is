'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn(
        'field',
        'description',
        'information_text',
        {
          transaction,
        },
      )
      await queryInterface.addColumn(
        'field',
        'tooltip',
        {
          type: Sequelize.JSON,
          allowNull: false,
          defaultValue: { is: '', en: '' },
        },
        { transaction },
      )
      await queryInterface.sequelize.query(
        `UPDATE "field"
         SET "tooltip" = "information_text",
             "information_text" = '{"is":"","en":""}'::json
         WHERE "field_type" IN ('TEXTBOX', 'NUMBERBOX')`,
        { transaction },
      )
      await queryInterface.sequelize.query(
        `UPDATE "field"
         SET "field_settings" = COALESCE("field_settings", '{}'::jsonb)
               || jsonb_build_object('subLabel',
                    CASE WHEN "field_settings"->'isLarge' = 'false'::jsonb
                      THEN '{"is":"","en":""}'::jsonb
                      ELSE "information_text"::jsonb
                    END),
             "information_text" = '{"is":"","en":""}'::json
         WHERE "field_type" = 'CHECKBOX'`,
        { transaction },
      )
      await queryInterface.sequelize.query(
        `UPDATE "field"
         SET "field_settings" = "field_settings" - 'hasDescription',
             "modified" = CURRENT_TIMESTAMP`,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
         SET "information_text" = CASE
               WHEN "field_type" IN ('TEXTBOX', 'NUMBERBOX') THEN "tooltip"
               WHEN "field_type" = 'CHECKBOX'
                 THEN COALESCE(("field_settings"->'subLabel')::json, '{"is":"","en":""}'::json)
               ELSE "information_text"
             END,
             "field_settings" = CASE
               WHEN "field_type" IN ('TEXTBOX', 'NUMBERBOX', 'CHECKBOX')
                 THEN (COALESCE("field_settings", '{}'::jsonb) - 'subLabel')
                   || '{"hasDescription":true}'::jsonb
               ELSE "field_settings"
             END,
             "modified" = CURRENT_TIMESTAMP`,
        { transaction },
      )
      await queryInterface.removeColumn('field', 'tooltip', { transaction })
      await queryInterface.renameColumn(
        'field',
        'information_text',
        'description',
        {
          transaction,
        },
      )
    })
  },
}
