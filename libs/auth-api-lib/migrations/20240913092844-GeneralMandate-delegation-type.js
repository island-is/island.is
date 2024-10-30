'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      BEGIN;

      INSERT INTO delegation_type (id, name, provider, description) VALUES ('GeneralMandate', 'General mandate', 'delegationdb', 'General mandate delegation type');

      INSERT INTO client_delegation_types (client_id, delegation_type) select client_id, 'GeneralMandate' from client_delegation_types where delegation_type = 'Custom';

      INSERT INTO api_scope_delegation_types (api_scope_name, delegation_type) select api_scope_name, 'GeneralMandate' from api_scope_delegation_types where delegation_type = 'Custom';

      COMMIT;
      `)
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      BEGIN;

      DELETE FROM client_delegation_types where delegation_type = 'GeneralMandate';

      DELETE FROM api_scope_delegation_types where delegation_type = 'GeneralMandate';

      DELETE FROM delegation_type WHERE id = 'GeneralMandate';

      COMMIT;
    `)
  },
}
