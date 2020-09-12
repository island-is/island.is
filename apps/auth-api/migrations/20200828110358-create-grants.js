'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;


      Create Table grant_type (
        id uuid NOT NULL,
        name VARCHAR NOT NULL,
        description VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (id)
      );

    COMMIT;
    `)
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      DROP TABLE grant_type;
    COMMIT;
    `)
  },
};

