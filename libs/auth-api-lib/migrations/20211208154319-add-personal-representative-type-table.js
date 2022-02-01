'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
        CREATE TABLE personal_representative_type (
          code VARCHAR NOT NULL,
          name VARCHAR NOT NULL,
          description VARCHAR NOT NULL,
          valid_to TIMESTAMP WITH TIME ZONE NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (code)
        );

        ALTER TABLE personal_representative ADD COLUMN personal_representative_type_code VARCHAR NOT NULL;

        ALTER TABLE personal_representative
        ADD CONSTRAINT FK_personal_representative_type FOREIGN KEY (personal_representative_type_code)
        REFERENCES personal_representative_type (code);

        COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE personal_representative DROP CONSTRAINT FK_personal_representative_type;
        ALTER TABLE personal_representative DROP COLUMN personal_representative_type_code;
        DROP TABLE personal_representative_type;

      COMMIT;
    `)
  },
}
