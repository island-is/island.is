'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'payment_flow_event',
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
            onDelete: 'CASCADE',
          },
          type: {
            type: Sequelize.ENUM('update', 'success', 'failure', 'deleted'),
            allowNull: false,
          },
          reason: {
            type: Sequelize.ENUM(
              'payment_started',
              'payment_completed',
              'payment_failed',
              'deleted_admin',
              'deleted_auto',
              'other',
            ),
            allowNull: false,
          },
          payment_method: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          occurred_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          message: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
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
      await queryInterface.dropTable('payment_flow_event', { transaction: t })
    })
  },
}
