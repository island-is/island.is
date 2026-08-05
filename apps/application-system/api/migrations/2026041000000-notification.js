'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('scheduled_notification', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
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
        application_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'application',
            key: 'id',
          },
        },
        template: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        application_state: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        schedule_time: {
          type: 'TIMESTAMP WITH TIME ZONE',
          allowNull: false,
        },
        schedule_status: {
          type: Sequelize.STRING, // e.g., 'PENDING', 'SENT', 'CANCELED', 'FAILED'
          allowNull: false,
          defaultValue: 'PENDING',
        },
      })
      .then(() =>
        Promise.all([
          // 1. Partial Index for the Polling Job:
          // Quickly finds notifications whose time has come.
          queryInterface.addIndex('scheduled_notification', ['schedule_time'], {
            name: 'scheduled_notification_pending_schedule_time_idx',
            where: {
              schedule_status: 'PENDING',
            },
          }),

          // 2. Partial Index for the Cancellation Job:
          // Quickly finds specific application's pending notifications to cancel.
          queryInterface.addIndex(
            'scheduled_notification',
            ['application_id'],
            {
              name: 'scheduled_notification_pending_app_idx',
              where: {
                schedule_status: 'PENDING',
              },
            },
          ),
        ]),
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('scheduled_notification')
  },
}
