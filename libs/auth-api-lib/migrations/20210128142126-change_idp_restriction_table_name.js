'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE idp_restrictions
      RENAME TO idp_providers;
    END;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE idp_providers
      RENAME TO idp_restrictions;
    END;
    `)
  },
}
