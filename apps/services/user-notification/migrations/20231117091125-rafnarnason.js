'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_notification', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      message_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      recipient: {
        type: Sequelize.STRING,
        allowNull: false
      },
      template_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      args: {
        type: Sequelize.JSON,
        allowNull: false
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      status: {
        type: Sequelize.ENUM('read', 'unread'),
        defaultValue: 'unread',
        allowNull: false
      }
    });

    await queryInterface.addIndex('user_notification', ['recipient']); // Adding index
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_notification');
  }
};
