'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
    COMMIT;
  `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
    COMMIT;
  `)
  },
}
