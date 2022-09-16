'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE delegation
          ADD COLUMN domain_name VARCHAR DEFAULT '@island.is' NOT NULL;
    
        ALTER TABLE delegation
            ADD CONSTRAINT fk_delegation_domain FOREIGN KEY (domain_name) REFERENCES domain (name);
        
        CREATE INDEX delegation__domain_name__index
            ON delegation (domain_name);

      COMMIT;
    `)
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        DROP INDEX delegation__domain_name__index;

        ALTER TABLE delegation
          DROP CONSTRAINT fk_delegation_domain;

        ALTER TABLE delegation
          DROP COLUMN domain_name;

      COMMIT;
    `)
  },
}
