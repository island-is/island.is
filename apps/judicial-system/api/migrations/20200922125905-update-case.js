'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('case', 'court_case_number', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'MISSING',
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('case', 'court_case_number'),
    ])
  },
}
