'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
      
        CREATE TABLE api_scope_user_access (
            national_id VARCHAR NOT NULL,
            scope VARCHAR NOT NULL,
            created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            modified TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY (national_id, scope),
            CONSTRAINT FK_api_scope_user_access_api_scope FOREIGN KEY (scope)
                REFERENCES public.api_scope (name)
        );

        CREATE TABLE api_scope_user (
            national_id VARCHAR NOT NULL,
            email VARCHAR NOT NULL,
            created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY (national_id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        DROP TABLE api_scope_user_access;
        DROP TABLE api_scope_user;
      
      COMMIT;
    `)
  },
}
