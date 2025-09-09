'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'UPDATE "client" SET sso = \'disabled\';',
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'UPDATE "client" SET sso = \'enabled\';',
    )
  },
}
