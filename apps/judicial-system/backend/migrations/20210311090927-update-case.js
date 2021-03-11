'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'isolation_to',
        {
          type: 'TIMESTAMP WITH TIME ZONE',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'isolation_to', {
        transaction: t,
      }),
    )
  },
}
