'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'case',
        'request_drivers_license_suspension',
        { type: Sequelize.BOOLEAN },
        { transaction },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn(
        'case',
        'request_drivers_license_suspension',
        { transaction },
      ),
    )
  },
}
