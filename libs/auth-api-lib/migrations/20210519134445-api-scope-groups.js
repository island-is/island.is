'use strict'
/* eslint-env node */

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE group_id (
          id UUID NOT NULL,
          name VARCHAR NOT NULL,
          description VARCHAR NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (id)
        );

        ALTER TABLE api_scope 
        ADD COLUMN group_id UUID NULL;

        ALTER TABLE api_scope 
        ADD CONSTRAINT FK_api_scope_api_scope_group FOREIGN KEY (group_id)
        REFERENCES public.group_id (id);

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE api_scope
      DROP COLUMN group_id;
      DROP TABLE group_id;
      COMMIT;
    `)
  },
}
