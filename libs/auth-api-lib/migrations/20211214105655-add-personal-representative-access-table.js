'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE TABLE personal_representative_access (
          id UUID NOT NULL,
          national_id_personal_representative VARCHAR NOT NULL,
          national_id_represented_person VARCHAR NOT NULL,
          service_provider VARCHAR NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        DROP TABLE personal_representative_access;
      COMMIT;
    `)
  },
}
