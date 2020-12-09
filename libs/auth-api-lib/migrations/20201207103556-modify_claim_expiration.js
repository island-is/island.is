'use strict'

const { timeStamp } = require('console')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE grants
      ALTER COLUMN expiration DROP NOT NULL;
    COMMIT;
  `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE grants
      ALTER COLUMN expiration SET NOT NULL;
    COMMIT;
  `)
  },
}
