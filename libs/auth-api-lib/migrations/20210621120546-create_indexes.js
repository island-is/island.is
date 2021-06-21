'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
        
        CREATE INDEX grants__client_id__index
        ON grants (client_id);

        CREATE INDEX grants__subject_id__index
        ON grants (subject_id);

        
        CREATE INDEX api_scope_group__domain_name__index
        ON api_scope_group (domain_name);

        
        CREATE INDEX api_scope__group_id__index
        ON api_scope (group_id);

      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        DROP INDEX grants__client_id__index;
        DROP INDEX grants__subject_id__index;
        DROP INDEX api_scope_group__domain_name__index;
        DROP INDEX api_scope__group_id__index;
      COMMIT;
    `)
  },
}
