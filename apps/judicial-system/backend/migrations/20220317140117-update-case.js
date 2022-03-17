'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'defender_is_spokesperson', {
        transaction: t,
      }),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'defender_is_spokesperson',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },
}
