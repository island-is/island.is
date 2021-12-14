'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE personal_representative ADD COLUMN external_user_id VARCHAR NOT NULL;
        
      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE personal_representative DROP COLUMN external_user_id;

      COMMIT;
    `)
  },
}
