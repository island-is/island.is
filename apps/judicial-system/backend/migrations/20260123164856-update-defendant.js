'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'defendant',
          'is_driving_license_suspended',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn(
          'defendant',
          'is_driving_license_suspended',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
