'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'case',
        'is_archived',
        { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        { transaction },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('case', 'is_archived', { transaction }),
    )
  },
}
