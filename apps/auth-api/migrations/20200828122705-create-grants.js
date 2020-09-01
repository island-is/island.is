'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;

    CREATE TABLE grant_type (
      id uuid NOT NULL,
      name VARCHAR NOT NULL,
      client_id  VARCHAR NOT NULL,
      PRIMARY KEY (id),
      description VARCHAR NULL
    );

    CREATE TABLE grants (
      id uuid NOT NULL,
      key VARCHAR NOT NULL,
      client_id  VARCHAR NOT NULL,
      creation_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
      data  VARCHAR NOT NULL,
      expiration TIMESTAMP WITH TIME ZONE DEFAULT now(),
      subject_id TIMESTAMP WITH TIME ZONE DEFAULT now(),
      type TIMESTAMP WITH TIME ZONE DEFAULT now(),
      PRIMARY KEY (id),
      CONSTRAINT FK_grant_client FOREIGN KEY (client_id) REFERENCES client (client_id)
    );

    CREATE TABLE client_grant_type (
      id uuid NOT NULL,
      client_id  VARCHAR NOT NULL,
      grant_type_id uuid NOT NULL,
      CONSTRAINT PK_client_grant_type PRIMARY KEY (id),
      CONSTRAINT FK_client_grant_type_client FOREIGN KEY (client_id) REFERENCES client (client_id),
      CONSTRAINT FK_client_grant_type_grant_type FOREIGN KEY (grant_type_id) REFERENCES grant_type (id)
    );

    COMMIT;
    `)
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      DROP TABLE client_grant_type;
      DROP TABLE grant_type;
      DROP TABLE grants;
    COMMIT;
    `)
  },
};

