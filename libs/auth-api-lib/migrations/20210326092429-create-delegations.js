'use strict'
/* eslint-env node */

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
      
        CREATE TABLE delegation (
            id uuid NOT NULL,
            from_national_id VARCHAR NOT NULL,
            from_display_name VARCHAR NOT NULL,
            is_from_company BOOLEAN NOT NULL DEFAULT false,
            to_national_id VARCHAR NOT NULL,
            valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            valid_to TIMESTAMP WITH TIME ZONE,
            valid_count VARCHAR,
            created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            modified TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY (id)
        );

        CREATE TABLE delegation_scope (
            delegation_id uuid NOT NULL,
            scope_name VARCHAR NOT NULL,
            created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY (delegation_id, scope_name),
            CONSTRAINT FK_delegation_scope_api_scope FOREIGN KEY (scope_name)
                REFERENCES public.api_scope (name),
            CONSTRAINT FK_delegation_scope_delegation FOREIGN KEY (delegation_id)
                REFERENCES public.delegation (id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        DROP TABLE delegation_scope;
        DROP TABLE delegation;
      
      COMMIT;
    `)
  },
}
