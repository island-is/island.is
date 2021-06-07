'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        DELETE FROM delegation_scope;
        DELETE FROM delegation;

        ALTER TABLE delegation
        DROP COLUMN valid_from,
        DROP COLUMN valid_to,
        ADD CONSTRAINT unique_from_to UNIQUE (from_national_id, to_national_id);
        

        ALTER TABLE delegation_scope
        ADD COLUMN valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        ADD COLUMN valid_to TIMESTAMP WITH TIME ZONE;

      COMMIT;
  `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE delegation
        ADD COLUMN valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        ADD COLUMN valid_to TIMESTAMP WITH TIME ZONE,
        DROP CONSTRAINT unique_from_to;

        ALTER TABLE delegation_scope
        DROP COLUMN valid_from,
        DROP COLUMN valid_to;
      COMMIT; 
`)
  },
}
