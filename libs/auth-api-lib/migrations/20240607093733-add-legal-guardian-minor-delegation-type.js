'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      INSERT INTO "delegation_type" (id, name, description, provider)
      VALUES ('LegalGuardianMinor', 'Legal Guardian minor', 'A legal guardian of a minor under 16 years', 'thjodskra');
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DELETE FROM "delegation_type" WHERE id = 'LegalGuardianMinor';
    `)
  },
}
