'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'actor_profile',
      'only_actionable_priority_notifications',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    )
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'actor_profile',
      'only_actionable_priority_notifications',
    )
  },
}
