'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'payment_worker_event',
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
          task_type: {
            type: Sequelize.STRING(64),
            allowNull: false,
          },
          status: {
            type: Sequelize.ENUM('success', 'failure'),
            allowNull: false,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          error_code: {
            type: Sequelize.STRING(64),
            allowNull: true,
          },
          message: {
            type: Sequelize.STRING(512),
            allowNull: true,
          },
          metadata: {
            type: Sequelize.JSON,
            allowNull: true,
          },
          modified: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction: t },
      )

      await queryInterface.addIndex(
        'payment_worker_event',
        ['payment_flow_id', 'task_type'],
        {
          name: 'payment_worker_event_payment_flow_id_task_type_idx',
          transaction: t,
        },
      )

      await queryInterface.addIndex(
        'payment_worker_event',
        ['payment_flow_id', 'task_type', 'created'],
        {
          name: 'payment_worker_event_flow_task_created_idx',
          transaction: t,
        },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeIndex(
        'payment_worker_event',
        'payment_worker_event_flow_task_created_idx',
        { transaction: t },
      )
      await queryInterface.removeIndex(
        'payment_worker_event',
        'payment_worker_event_payment_flow_id_task_type_idx',
        { transaction: t },
      )
      await queryInterface.dropTable('payment_worker_event', {
        transaction: t,
      })
    })
  },
}
