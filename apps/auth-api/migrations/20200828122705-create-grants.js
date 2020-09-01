'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

      CREATE TABLE grant_type (
        id uuid NOT NULL,
        name VARCHAR NOT NULL,
        client_id  VARCHAR NOT NULL,
        PRIMARY KEY (id),
        description VARCHAR NULL
      );

      CREATE TABLE grant (
        id uuid NOT NULL,
        key VARCHAR NOT NULL,
        client_id  VARCHAR NOT NULL,
        creation_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
        data  VARCHAR NOT NULL,
        expiration TIMESTAMP WITH TIME ZONE DEFAULT now(),
        subject_id TIMESTAMP WITH TIME ZONE DEFAULT now(),
        type TIMESTAMP WITH TIME ZONE DEFAULT now(),
        PRIMARY KEY (id),
        CONSTRAINT FK_grant_client FOREIGN KEY (client_id) REFERENCES client (client_id),
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
