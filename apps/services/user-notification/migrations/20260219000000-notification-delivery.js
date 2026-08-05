'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notification_delivery', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_notification_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'user_notification', key: 'id' },
        onDelete: 'CASCADE',
      },
      actor_notification_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'actor_notification', key: 'id' },
        onDelete: 'CASCADE',
      },
      channel: {
        type: Sequelize.ENUM('email', 'sms', 'push'),
        allowNull: false,
      },
      sent_to: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    await queryInterface.addIndex(
      'notification_delivery',
      ['user_notification_id'],
      {
        name: 'notification_delivery_user_notification_id_idx',
      },
    )
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notification_delivery')
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_notification_delivery_channel";',
    )
  },
}
