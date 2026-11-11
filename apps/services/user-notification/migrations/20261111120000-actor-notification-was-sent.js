'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('actor_notification', 'was_sent', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('actor_notification', 'was_sent')
  },
}
