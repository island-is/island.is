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
      root_message_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      recipient: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      on_behalf_of_national_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      scope: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('actor_notification')
  },
}
