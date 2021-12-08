'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'deductionFactors',
          'amount_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'amount',
              key: 'id',
            },
            allowNull: false,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('deductionFactors', 'amount_id', {
          transaction: t,
        }),
      ]),
    )
  },
}
