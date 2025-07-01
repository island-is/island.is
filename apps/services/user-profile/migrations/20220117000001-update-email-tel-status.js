'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(() =>
      Promise.all([
        queryInterface.addColumn('user_profile', 'email_status', {
          type: Sequelize.ENUM(
            'NOT_DEFINED',
            'NOT_VERIFIED',
            'VERIFIED',
            'EMPTY',
          ),
          defaultValue: 'NOT_DEFINED',
          allowNull: false,
        }),
        queryInterface.addColumn('user_profile', 'mobile_status', {
          type: Sequelize.ENUM(
            'NOT_DEFINED',
            'NOT_VERIFIED',
            'VERIFIED',
            'EMPTY',
          ),
          defaultValue: 'NOT_DEFINED',
          allowNull: false,
        }),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('user_profile', 'email_status', {
          transaction: t,
        }),
        queryInterface.removeColumn('user_profile', 'mobile_status', {
          transaction: t,
        }),
      ]),
    )
  },
}
