'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      UPDATE identity_resource set
        grant_to_legal_guardians = false
      WHERE 
        grant_to_legal_guardians is null;

      UPDATE identity_resource set
        grant_to_procuring_holders = false
      WHERE 
        grant_to_procuring_holders is null;

      UPDATE identity_resource set
        allow_explicit_delegation_grant = false
      WHERE 
        allow_explicit_delegation_grant is null;

      UPDATE identity_resource set
        automatic_delegation_grant = false
      WHERE 
        automatic_delegation_grant is null;

      UPDATE identity_resource set
        also_for_delegated_user = false
      WHERE 
        also_for_delegated_user is null;
      
      ALTER TABLE identity_resource
      ALTER COLUMN grant_to_legal_guardians SET NOT NULL,
      ALTER COLUMN grant_to_procuring_holders SET NOT NULL,
      ALTER COLUMN allow_explicit_delegation_grant SET NOT NULL,
      ALTER COLUMN automatic_delegation_grant SET NOT NULL,
      ALTER COLUMN also_for_delegated_user SET NOT NULL;
    COMMIT;
  `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE identity_resource
      ALTER COLUMN grant_to_legal_guardians DROP NOT NULL,
      ALTER COLUMN grant_to_procuring_holders DROP NOT NULL,
      ALTER COLUMN allow_explicit_delegation_grant DROP NOT NULL,
      ALTER COLUMN automatic_delegation_grant DROP NOT NULL,
      ALTER COLUMN also_for_delegated_user DROP NOT NULL;
    COMMIT;
  `)
  },
}
