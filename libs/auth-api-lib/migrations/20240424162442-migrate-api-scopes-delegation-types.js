'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      BEGIN;
        INSERT INTO api_scope_delegation_types (api_scope_name, delegation_type)
        SELECT name, 'Custom'
        FROM api_scope
        WHERE allow_explicit_delegation_grant = true;

        INSERT INTO api_scope_delegation_types (api_scope_name, delegation_type)
        SELECT name, 'LegalGuardian'
        FROM api_scope
        WHERE grant_to_legal_guardians = true;

        INSERT INTO api_scope_delegation_types (api_scope_name, delegation_type)
        SELECT name, 'ProcurationHolder'
        FROM api_scope
        WHERE grant_to_procuring_holders = true;

        INSERT INTO api_scope_delegation_types (api_scope_name, delegation_type)
        SELECT prsp.api_scope_name, CONCAT('PersonalRepresentative:', prrt.code)
        FROM personal_representative_right_type prrt
        JOIN personal_representative_scope_permission prsp ON prrt.code = prsp.right_type_code
        JOIN api_scope apis ON prsp.api_scope_name = apis.name
        WHERE prrt.valid_from < NOW() AND prrt.valid_to > NOW() AND apis.grant_to_personal_representatives = true;

      COMMIT;
    `)
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      BEGIN;
        DELETE FROM api_scope_delegation_types;
      COMMIT;
    `)
  },
}
