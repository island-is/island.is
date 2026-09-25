'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_notification', 'priority_type', {
      type: Sequelize.ENUM('Informative', 'Actionable'),
      allowNull: true,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('user_notification', 'priority_type')
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_user_notification_priority_type";',
    )
  },
}
