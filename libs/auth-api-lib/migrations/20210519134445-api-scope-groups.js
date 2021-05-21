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
        ADD COLUMN group_id UUID NULL;

        ALTER TABLE api_scope 
        ADD CONSTRAINT FK_api_scope_api_scope_group FOREIGN KEY (group_id)
        REFERENCES api_scope_group (id);

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE api_scope
      DROP COLUMN group_id;
      DROP TABLE api_scope_group;
      COMMIT;
    `)
  },
}
