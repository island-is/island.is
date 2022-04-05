'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'applications',
          'has_fetched_direct_tax_payment',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'spouse_has_fetched_direct_tax_payment',
          {
            type: Sequelize.BOOLEAN,
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
        queryInterface.removeColumn(
          'applications',
          'has_fetched_direct_tax_payment',
          {
            transaction: t,
          },
        ),
        queryInterface.removeColumn(
          'applications',
          'spouse_has_fetched_direct_tax_payment',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
