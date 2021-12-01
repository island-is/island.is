'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'amount',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          aid_amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          income: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          deductionFactors_id: {
            type: Sequelize.UUID,
            references: {
              model: 'deductionFactors',
              key: 'id',
            },
            allowNull: true,
          },
          personalTaxCredit: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          spouse_personalTaxCredit: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          tax: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          final_amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          created: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('amount', { transaction: t }),
    )
  },
}
