'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE grants 
      ALTER COLUMN session_id 
      DROP NOT NULL;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE grants 
      ALTER COLUMN session_id 
      SET NOT NULL;
    `)
  },
}
