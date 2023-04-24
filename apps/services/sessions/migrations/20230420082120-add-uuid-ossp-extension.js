'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `)
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      DROP EXTENSION IF EXISTS "uuid-ossp";
  `)
  },
}
