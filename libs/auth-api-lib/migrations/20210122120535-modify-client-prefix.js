'use strict'

const { timeStamp } = require('console')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE client
      ALTER COLUMN client_claims_prefix DROP NOT NULL;
    COMMIT;
  `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE client
      ALTER COLUMN client_claims_prefix SET NOT NULL;
    COMMIT;
  `)
  },
}
