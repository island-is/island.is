'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'lawyer_registry',
        'has_court_of_appeals_rights',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn(
        'lawyer_registry',
        'has_court_of_appeals_rights',
        {
          transaction: t,
        },
      ),
    )
  },
}
