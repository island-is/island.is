'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.changeColumn(
        'case',
        'requested_other_restrictions',
        {
          type: Sequelize.TEXT,
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.changeColumn(
        'case',
        'requested_other_restrictions',
        {
          type: Sequelize.STRING,
        },
        { transaction: t },
      ),
    )
  },
}
