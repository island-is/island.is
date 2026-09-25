'use strict'

module.exports = {
  async up(queryInterface) {
    // Separate non-transactional migration: avoid blocking writes while indexing.
    await queryInterface.sequelize.query(
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS notification_delivery_created_metrics_idx ON notification_delivery (created)',
    )
    await queryInterface.sequelize.query(
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS user_notification_created_metrics_idx ON user_notification (created)',
    )
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'DROP INDEX CONCURRENTLY IF EXISTS notification_delivery_created_metrics_idx',
    )
    await queryInterface.sequelize.query(
      'DROP INDEX CONCURRENTLY IF EXISTS user_notification_created_metrics_idx',
    )
  },
}
