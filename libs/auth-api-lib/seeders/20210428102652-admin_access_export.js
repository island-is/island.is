'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
      
        INSERT INTO api_scope_user (national_id, email)
          SELECT national_id, email
        FROM admin_access;
      

        INSERT INTO api_scope_user_access (national_id, scope)
          SELECT national_id, scope
        FROM admin_access;


      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
    
        DELETE FROM api_scope_user;
        DELETE FROM api_scope_user_access;

      COMMIT;
    `)
  },
}
