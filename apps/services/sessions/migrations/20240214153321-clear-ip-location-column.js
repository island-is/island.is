'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove clear all data from the ip_location column due to bug caused by outdated GEOIP database
    await queryInterface.sequelize.query(
      'UPDATE session SET ip_location = NULL',
    )
  },

  async down(queryInterface, Sequelize) {
    // Irreversible migration due to clearing all data from the ip_location column
    // We cannot restore the data that was cleared.
  },
}
