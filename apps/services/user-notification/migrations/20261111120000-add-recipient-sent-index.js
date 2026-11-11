'use strict'

const INDEX_NAME = 'user_notification_recipient_id_sent_idx'

// Supports the default user-facing list and count queries, which only return
// notifications that were sent:
//   WHERE recipient = ? AND was_sent = true ORDER BY id DESC LIMIT n
// Created concurrently so the table is not locked, which cannot run inside a
// transaction, so this migration deliberately runs without one.
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS "${INDEX_NAME}"
        ON "user_notification" ("recipient", "id" DESC)
        WHERE "was_sent" = true;`,
    )
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DROP INDEX CONCURRENTLY IF EXISTS "${INDEX_NAME}";`,
    )
  },
}
