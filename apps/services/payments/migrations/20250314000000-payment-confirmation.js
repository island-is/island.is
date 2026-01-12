'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'payment_flow_payment_confirmation',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          payment_flow_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'payment_flow',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          masked_card_number: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          acquirer_reference_number: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          authorization_code: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          card_scheme: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          total_price: {
            type: Sequelize.DOUBLE,
            allowNull: false,
          },
          card_usage: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          modified: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('payment_flow_payment_confirmation', {
        transaction: t,
      })
    })
  },
}
