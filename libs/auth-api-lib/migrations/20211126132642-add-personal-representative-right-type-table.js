'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
        CREATE TABLE personal_representative_right_type (
          code VARCHAR NOT NULL,
          description VARCHAR NOT NULL,
          valid_from TIMESTAMP WITH TIME ZONE NULL,
          valid_to TIMESTAMP WITH TIME ZONE NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (code)
      );
      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        DROP TABLE personal_representative_right_type;
      COMMIT;
    `)
  },
}
