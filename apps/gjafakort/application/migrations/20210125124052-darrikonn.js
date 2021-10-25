'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        UPDATE application SET data = jsonb_set(data, '{mobileNumber}', '6805215')
        WHERE type = 'gjafakort-user' AND issuer_ssn = '1008862009';

      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    // do nothing
  },
}
