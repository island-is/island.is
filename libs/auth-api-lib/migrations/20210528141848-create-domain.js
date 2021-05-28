'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE TABLE domain (
        name VARCHAR NOT NULL,
        description VARCHAR NOT NULL,
        national_id VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (name)
        );

        ALTER TABLE api_scope_group 
        ADD COLUMN domain_name VARCHAR NULL;

        ALTER TABLE api_scope_group 
        ADD CONSTRAINT FK_api_scope_group_domain FOREIGN KEY (domain_name)
        REFERENCES domain (name);

    COMMIT;
  `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE api_scope_group
      DROP COLUMN domain_name;
      DROP TABLE domain;
      COMMIT;
    `)
  },
}
