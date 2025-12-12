'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('actor_notification', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_notification_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user_notification',
          key: 'id',
        },
      },
      message_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      recipient: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    // Create indexes
    // Index on user_notification_id for joins
    await queryInterface.addIndex(
      'actor_notification',
      ['user_notification_id'],
      {
        name: 'actor_notification_user_notification_id_idx',
      },
    )

    // Composite index on (recipient, id DESC) for efficient querying and sorting
    // This supports queries filtering by recipient and sorting by id DESC
    await queryInterface.addIndex('actor_notification', ['recipient', 'id'], {
      name: 'actor_notification_recipient_id_idx',
    })

    // Index on message_id for duplicate checking
    await queryInterface.addIndex('actor_notification', ['message_id'], {
      name: 'actor_notification_message_id_idx',
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('actor_notification')
  },
}
