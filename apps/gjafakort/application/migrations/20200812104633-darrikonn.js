'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        UPDATE application SET data = jsonb_set(data, '{mobileNumber}', '6952527')
        WHERE type = 'gjafakort-user' AND issuer_ssn = '3110833849';

      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    // do nothing
  },
}
