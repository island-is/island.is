'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'accused_plea_decision',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'accused_plea_decision', {
        transaction: t,
      }),
    )
  },
}
