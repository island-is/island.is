'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'request_court_of_appeal_ruling_to_be_not_published',
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
        'case',
        'request_court_of_appeal_ruling_to_be_not_published',
        {
          transaction: t,
        },
      ),
    )
  },
}
