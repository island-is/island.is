'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

      CREATE TABLE grant_type (
        id uuid NOT NULL,
        name VARCHAR NOT NULL,
        PRIMARY KEY (id),
        description VARCHAR NULL
      );

      COMMIT;
    `)
  },

  down: async (queryInterface, Sequelize) => {
    down: (queryInterface) => {
      return queryInterface.sequelize.query(`
        BEGIN;
          DROP TABLE grant_type;
        COMMIT;
      `)
    },
  }
};
