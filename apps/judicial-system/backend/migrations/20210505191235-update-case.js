'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'set_court_case_number_manually', {
        transaction: t,
      }),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'set_court_case_number_manually',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },
}
