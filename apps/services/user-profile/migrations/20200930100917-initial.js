'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('user_profile', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        national_id: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        mobile_phone_number: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        profile_image_url: {
          type: Sequelize.STRING,
        },
        locale: {
          type: Sequelize.ENUM('en', 'is'),
          allowNull: true,
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
      .then(() => queryInterface.addIndex('user_profile', ['national_id']))
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('user_profile')
  },
}
