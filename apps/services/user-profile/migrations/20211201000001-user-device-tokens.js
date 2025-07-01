'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('user_device_tokens', {
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
          // the devicetoken can be BIG - max 4096 bytes - FCM documentation
          type: Sequelize.STRING(4096),
          allowNull: false,
          unique: true,
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
      .then(() =>
        queryInterface.addIndex('user_device_tokens', ['national_id']),
      )
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('user_device_tokens')
  },
}
