'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_notification', 'sender_id', {
      type: Sequelize.STRING,
      allowNull: true, // Make it nullable if it's optional
    })
  },

  async down(queryInterface) {
    // Logic for reverting the changes
    await queryInterface.removeColumn('user_notification', 'sender_id')
  },
}
