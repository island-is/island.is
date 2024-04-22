'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_notification', 'status')

    await queryInterface.addColumn('user_notification', 'read', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })

    await queryInterface.addColumn('user_notification', 'seen', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_notification', 'status', {
      type: Sequelize.ENUM('read', 'unread'),
      defaultValue: 'unread',
      allowNull: false,
    })

    await queryInterface.removeColumn('user_notification', 'read')
    await queryInterface.removeColumn('user_notification', 'seen')
  },
}
