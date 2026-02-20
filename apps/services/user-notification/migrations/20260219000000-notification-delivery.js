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
      message_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      channel: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    await queryInterface.addIndex('notification_delivery', ['message_id'], {
      name: 'notification_delivery_message_id_idx',
    })

    await queryInterface.addConstraint('notification_delivery', {
      fields: ['message_id', 'channel'],
      type: 'unique',
      name: 'notification_delivery_message_id_channel_unique',
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notification_delivery')
  },
}
