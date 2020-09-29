'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'court_case_number',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'court_case_number', {
        transaction: t,
      }),
    )
  },
}
