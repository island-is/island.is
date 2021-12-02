'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('user_notifications', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        national_id: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false,
        },
        device_token: {
          // the devicetoken can be huge - max 4096 bytes
          type: Sequelize.STRING(4096),
          allowNull: false,
          unique: true,
        },
        is_enabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
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
      })
      .then(() => queryInterface.addIndex('user_notifications', ['national_id']))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_notifications')
  },
}
