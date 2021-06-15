'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE delegation_scope
      DROP CONSTRAINT fk_delegation_scope_api_scope;
    COMMIT;
  `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE delegation_scope
      ADD CONSTRAINT FK_delegation_scope_api_scope FOREIGN KEY (scope_name)
          REFERENCES api_scope (name);
    COMMIT;
  `)
  },
}
