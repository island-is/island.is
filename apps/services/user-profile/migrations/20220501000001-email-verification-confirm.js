'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'email_verification',
          'confirmed',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('email_verification', 'confirmed', {
          transaction: t,
        }),
      ]),
    )
  },
}
