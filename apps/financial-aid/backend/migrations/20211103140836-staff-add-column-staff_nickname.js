'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'staff',
          'nickname',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('staff', 'nickname', {
          transaction: t,
        }),
      ]),
    )
  },
}
