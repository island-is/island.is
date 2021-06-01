'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        INSERT INTO domain(
        name, description, national_id, created, modified)
        VALUES ('@island.is', '@island.is domain', '5501692829', now(), null);
        
        UPDATE api_scope_group
        SET domain_name='@island.is';

        ALTER TABLE api_scope_group 
        ALTER COLUMN domain_name SET NOT NULL;
    COMMIT;
  `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE api_scope_group 
      ALTER COLUMN domain_name DROP NOT NULL;

      UPDATE api_scope_group
      SET domain_name=NULL;

      DELETE FROM domain where name = '@island.is';
    COMMIT; 
`)
  },
}
