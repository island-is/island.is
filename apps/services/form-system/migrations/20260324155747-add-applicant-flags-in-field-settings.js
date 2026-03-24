'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
       SET "field_settings" = jsonb_set(
         jsonb_set(
           COALESCE("field_settings", '{}'::jsonb),
           '{isPhoneRequired}',
           'true'::jsonb,
           true
         ),
         '{isEmailRequired}',
         'true'::jsonb,
         true
       ),
       "modified" = CURRENT_TIMESTAMP
       WHERE "field_type" = 'APPLICANT'
         AND ("field_settings"->>'applicantType') IS DISTINCT FROM 'LEGAL_ENTITY_OF_PROCURATION_HOLDER'`,
        { transaction: t },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
       SET "field_settings" = (COALESCE("field_settings", '{}'::jsonb) - 'isPhoneRequired' - 'isEmailRequired'),
           "modified" = CURRENT_TIMESTAMP
       WHERE "field_type" = 'APPLICANT'
         AND ("field_settings"->>'applicantType') IS DISTINCT FROM 'LEGAL_ENTITY_OF_PROCURATION_HOLDER'`,
        { transaction: t },
      )
    })
  },
}
