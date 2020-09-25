'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'case',
          'court_start_time',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'court_end_time',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'court_attendees',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'police_demands',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'suspect_plea',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'litigation_presentations',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('case', 'court_start_time', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'court_end_time', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'court_attendees', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'police_demands', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'suspect_plea', { transaction: t }),
        queryInterface.removeColumn('case', 'litigation_presentations', {
          transaction: t,
        }),
      ])
    })
  },
}
