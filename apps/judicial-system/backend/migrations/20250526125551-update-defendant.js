'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'defendant',
          'information_for_defendant',
          {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: [],
            allowNull: false,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('defendant', 'information_for_defendant', {
          transaction: t,
        }),
      ]),
    )
  },
}
