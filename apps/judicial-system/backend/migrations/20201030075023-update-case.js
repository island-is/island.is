'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'court_date',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'court_room',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'defender_name',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'defender_email',
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
        queryInterface.removeColumn('case', 'court_date', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'court_room', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'defender_name', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'defender_email', {
          transaction: t,
        }),
      ]),
    )
  },
}
