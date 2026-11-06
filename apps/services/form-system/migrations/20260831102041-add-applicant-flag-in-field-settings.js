'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
       SET "field_settings" = jsonb_set(
         COALESCE("field_settings", '{}'::jsonb),
         '{isAddressRequired}',
         'false'::jsonb,
         true
       ),
       "modified" = CURRENT_TIMESTAMP
       WHERE "field_type" = 'APPLICANT'
         AND ("field_settings"->>'applicantType') NOT IN ('LEGAL_ENTITY', 'LEGAL_ENTITY_OF_PROCURATION_HOLDER', 'INDIVIDUAL_GIVING_DELEGATION', 'WARD_OF_LEGAL_GUARDIAN')`,
        { transaction: t },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `UPDATE "field"
      SET "field_settings" = (COALESCE("field_settings", '{}'::jsonb) - 'isAddressRequired'),
           "modified" = CURRENT_TIMESTAMP
       WHERE "field_type" = 'APPLICANT'
         AND ("field_settings"->>'applicantType') NOT IN ('LEGAL_ENTITY', 'LEGAL_ENTITY_OF_PROCURATION_HOLDER', 'INDIVIDUAL_GIVING_DELEGATION', 'WARD_OF_LEGAL_GUARDIAN')`,
        { transaction: t },
      )
    })
  },
}
