'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(() =>
      Promise.all([
        queryInterface.addColumn('sms_verification', 'tries', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        }),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(() =>
      Promise.all([queryInterface.removeColumn('sms_verification', 'tries')]),
    )
  },
}
