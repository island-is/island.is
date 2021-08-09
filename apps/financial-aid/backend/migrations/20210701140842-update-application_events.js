'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'application_events',
          'comment',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.sequelize
          .query(`UPDATE "application_events" SET comment to allow NULL;`, {
            transaction: t,
          })
          .then(() =>
            queryInterface.changeColumn(
              'application_events',
              'comment',
              {
                type: Sequelize.STRING,
                allowNull: false,
              },
              { transaction: t },
            ),
          ),
      ]),
    )
  },
}
