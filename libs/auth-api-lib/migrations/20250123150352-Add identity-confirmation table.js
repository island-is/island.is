'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('identity_confirmation', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      ticketId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('email', 'web', 'mobile'),
        allowNull: false,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable('identity_confirmation')
  },
}
