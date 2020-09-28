'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.addColumn(
        'case',
        'court_case_number',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.removeColumn('case', 'court_case_number', {
        transaction: t,
      })
    })
  },
}
