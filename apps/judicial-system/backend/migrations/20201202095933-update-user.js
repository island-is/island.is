'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'user',
        'institution',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'Lögreglustjórinn á höfuðborgarsvæðinu',
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('user', 'institution', { transaction: t }),
    )
  },
}
