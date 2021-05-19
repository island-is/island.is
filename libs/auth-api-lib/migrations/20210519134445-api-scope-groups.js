'use strict'
/* eslint-env node */

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE api_scope_group (
          id UUID NOT NULL,
          name VARCHAR NOT NULL,
          description VARCHAR NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (id)
        );

        ALTER TABLE api_scope 
        ADD COLUMN api_scope_group UUID NULL;

        ALTER TABLE api_scope 
        ADD CONSTRAINT FK_api_scope_api_scope_group FOREIGN KEY (api_scope_group)
        REFERENCES public.api_scope_group (id);

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE api_scope
      DROP COLUMN api_scope_group;
      DROP TABLE api_scope_group;
      COMMIT;
    `)
  },
}
