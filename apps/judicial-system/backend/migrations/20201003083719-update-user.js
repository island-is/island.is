'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'user',
        'title',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'óþekkt',
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('user', 'title', {
        transaction: t,
      }),
    )
  },
}
