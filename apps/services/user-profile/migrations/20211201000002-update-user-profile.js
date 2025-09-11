'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'user_profile',
          'document_notifications',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('user_profile', 'document_notifications', {
          transaction: t,
        }),
        queryInterface.removeColumn('user_profile', 'document_notifications', {
          transaction: t,
        }),
      ]),
    )
  },
}
