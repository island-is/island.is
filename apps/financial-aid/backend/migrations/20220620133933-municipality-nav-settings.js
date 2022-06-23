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
        queryInterface.addColumn(
          'municipality',
          'nav_username',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'municipality',
          'nav_password',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'nav_success',
          {
            type: Sequelize.BOOLEAN,
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
        queryInterface.removeColumn('municipality', 'nav_username', {
          transaction: t,
        }),
        queryInterface.removeColumn('municipality', 'nav_password', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'nav_success', {
          transaction: t,
        }),
      ]),
    )
  },
}
