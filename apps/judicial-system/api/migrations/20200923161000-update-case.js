'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('case', 'court_start_time', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'court_end_time', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'court_attendees', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'police_demands', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'suspect_plea', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'litigation_presentations', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('case', 'court_start_time'),
      queryInterface.removeColumn('case', 'court_end_time'),
      queryInterface.removeColumn('case', 'court_attendees'),
      queryInterface.removeColumn('case', 'police_demands'),
      queryInterface.removeColumn('case', 'suspect_plea'),
      queryInterface.removeColumn('case', 'litigation_presentations'),
    ])
  },
}
