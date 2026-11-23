'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'appeal_case',
        'appeal_ruling_type',
        { type: Sequelize.STRING, allowNull: true },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('appeal_case', 'appeal_ruling_type', {
        transaction: t,
      }),
    )
  },
}
