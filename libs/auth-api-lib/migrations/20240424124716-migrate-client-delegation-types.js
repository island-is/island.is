'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      BEGIN;
        INSERT INTO client_delegation_types (client_id, delegation_type)
        SELECT client_id, 'Custom'
        FROM client
        WHERE supports_custom_delegation = true;

        INSERT INTO client_delegation_types (client_id, delegation_type)
        SELECT client_id, 'LegalGuardian'
        FROM client
        WHERE supports_legal_guardians = true;

        INSERT INTO client_delegation_types (client_id, delegation_type)
        SELECT client_id, 'ProcurationHolder'
        FROM client
        WHERE supports_procuring_holders = true;

        INSERT INTO client_delegation_types (client_id, delegation_type)
        SELECT c.client_id, dt.id
        FROM client c
        JOIN delegation_type dt ON dt.provider = 'talsmannagrunnur'
        WHERE c.supports_personal_representatives = true;

      COMMIT;
    `)
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      BEGIN;
        DELETE FROM client_delegation_types;
      COMMIT;
    `)
  },
}
