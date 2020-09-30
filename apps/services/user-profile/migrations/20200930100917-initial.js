'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    console.log('UP user profile')
    console.log(queryInterface)
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
        },
        mobile_phone_number: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        profile_image_url: {
          type: Sequelize.STRING,
        },
        locale: {
          type: Sequelize.STRING,
          allowNull: false,
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

  down: (queryInterface, Sequelize) => {
    console.log('down user profile')
    return queryInterface.dropTable('user_profile')
  },
}
