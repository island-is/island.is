'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'user_profile',
          'email_verified',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'user_profile',
          'mobile_phone_number_verified',
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
        queryInterface.removeColumn('user_profile', 'email_verified', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'user_profile',
          'mobile_phone_number_verified',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
