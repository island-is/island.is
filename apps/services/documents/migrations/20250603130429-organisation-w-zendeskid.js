'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'organisation',
          'zendesk_id',
          {
            type: Sequelize.STRING,
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
        queryInterface.removeColumn('organisation', 'zendesk_id', {
          transaction: t,
        }),
      ]),
    )
  },
}
