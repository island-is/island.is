'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'defendant',
        'service_requirement',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('defendant', 'service_requirement', {
        transaction: t,
      }),
    )
  },
}
