'use strict'

const TABLE = 'payment_flow_debt'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        TABLE,
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          payment_flow_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'payment_flow',
              key: 'id',
            },
            onDelete: 'CASCADE',
          },
          pay_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          // int64 on the FJS side
          amount: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          label: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
        },
        {
          transaction: t,
          uniqueKeys: {
            // A debt can only be part of a payment flow once.
            payment_flow_debt_payment_flow_id_pay_id_unique: {
              fields: ['payment_flow_id', 'pay_id'],
            },
          },
        },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable(TABLE, { transaction: t })
    })
  },
}
