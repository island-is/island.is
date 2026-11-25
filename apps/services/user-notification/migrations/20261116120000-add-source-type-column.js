'use strict'

const SOURCE_TYPES = ['Mail', 'Event', 'General']

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'user_notification',
        'source_type',
        { type: Sequelize.ENUM(...SOURCE_TYPES), allowNull: true },
        { transaction },
      )
      await queryInterface.addColumn(
        'user_notification_sender',
        'source_type',
        { type: Sequelize.ENUM(...SOURCE_TYPES), allowNull: true },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('user_notification', 'source_type', {
        transaction,
      })
      await queryInterface.removeColumn(
        'user_notification_sender',
        'source_type',
        { transaction },
      )
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_user_notification_source_type";',
        { transaction },
      )
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_user_notification_sender_source_type";',
        { transaction },
      )
    })
  },
}
