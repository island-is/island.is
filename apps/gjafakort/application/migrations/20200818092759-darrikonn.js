'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        UPDATE application SET data = jsonb_set(data, '{mobileNumber}', '8518987')
        WHERE type = 'gjafakort-user' AND issuer_ssn = '1306873269';

      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    // do nothing
  },
}
