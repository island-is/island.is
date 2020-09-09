'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
    CREATE TABLE grants (
      id uuid NOT NULL,
      key VARCHAR NOT NULL,
      client_id  VARCHAR NOT NULL,
      data  VARCHAR NOT NULL,
      expiration TIMESTAMP WITH TIME ZONE DEFAULT now(),
      subject_id VARCHAR NOT NULL,
      type VARCHAR NOT NULL,
      created TIMESTAMP WITH TIME ZONE DEFAULT now(),
      modified TIMESTAMP WITH TIME ZONE,
      PRIMARY KEY (id),
      CONSTRAINT FK_grant_client FOREIGN KEY (client_id) REFERENCES client (client_id)
    );
    COMMIT;
    `)
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      DROP TABLE grants;
    COMMIT;
    `)
  },
};

