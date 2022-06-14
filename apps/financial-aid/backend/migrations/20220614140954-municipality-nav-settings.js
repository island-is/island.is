'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'municipality',
          'using_nav',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'municipality',
          'nav_url',
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
        queryInterface.removeColumn('municipality', 'using_nav', {
          transaction: t,
        }),
        queryInterface.removeColumn('municipality', 'nav_url', {
          transaction: t,
        }),
      ]),
    )
  },
}
