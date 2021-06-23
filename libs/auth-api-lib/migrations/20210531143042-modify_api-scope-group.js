'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE api_scope_group 
        ADD COLUMN display_name VARCHAR NULL;

        UPDATE api_scope_group SET display_name = 'Temporary Display Name';

        ALTER TABLE api_scope_group 
        ALTER COLUMN display_name SET NOT NULL;

    COMMIT;
  `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE api_scope_group
      DROP COLUMN display_name;
      
      COMMIT;
    `)
  },
}
