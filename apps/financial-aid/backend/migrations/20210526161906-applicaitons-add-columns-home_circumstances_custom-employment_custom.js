'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'applications',
          'home_circumstances_custom',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'employment_custom',
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
        queryInterface.removeColumn(
          'applications',
          'home_circumstances_custom',
          {
            transaction: t,
          },
        ),
        queryInterface.removeColumn('applications', 'employment_custom', {
          transaction: t,
        }),
      ]),
    )
  },
}
