'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex(
      'notification_delivery',
      ['actor_notification_id'],
      {
        name: 'notification_delivery_actor_notification_id_idx',
      },
    )
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'notification_delivery',
      'notification_delivery_actor_notification_id_idx',
    )
  },
}
