'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
        CREATE TABLE translation (
          language VARCHAR NOT NULL,
          class_name VARCHAR NOT NULL,
          key VARCHAR NOT NULL,
          property VARCHAR NOT NULL,
          value VARCHAR NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (language, class_name, key, property)
      );
      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        DROP TABLE translation;
      COMMIT;
    `)
  },
}
