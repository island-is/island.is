'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Add delivery tracking fields to payment_flow_event table
      await queryInterface.addColumn(
        'payment_flow_event',
        'delivered_to_upstream',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: null,
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'payment_flow_event',
        'delivered_at',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'payment_flow_event',
        'delivery_error',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      )

      // Add index for querying failed deliveries
      await queryInterface.addIndex(
        'payment_flow_event',
        ['delivered_to_upstream'],
        {
          name: 'idx_payment_flow_event_delivery_status',
          where: {
            delivered_to_upstream: false,
          },
          transaction: t,
        },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Remove the index
      await queryInterface.removeIndex(
        'payment_flow_event',
        'idx_payment_flow_event_delivery_status',
        { transaction: t },
      )

      // Remove the columns
      await queryInterface.removeColumn(
        'payment_flow_event',
        'delivery_error',
        { transaction: t },
      )

      await queryInterface.removeColumn('payment_flow_event', 'delivered_at', {
        transaction: t,
      })

      await queryInterface.removeColumn(
        'payment_flow_event',
        'delivered_to_upstream',
        { transaction: t },
      )
    })
  },
}
