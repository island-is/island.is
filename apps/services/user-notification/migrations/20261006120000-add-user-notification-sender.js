'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'user_notification_sender',
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          recipient: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          sender_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          // Slugified Icelandic HnippCategory, null when the template has no
          // category, which is presented as 'almennt'
          category: {
            type: Sequelize.STRING,
            allowNull: true,
          },
        },
        { transaction },
      )

      await queryInterface.addIndex(
        'user_notification_sender',
        ['recipient', 'sender_id', 'category'],
        {
          name: 'user_notification_sender_recipient_sender_id_category_idx',
          unique: true,
          transaction,
        },
      )

      // Unique indexes treat nulls as distinct, so uncategorized rows need
      // their own partial index
      await queryInterface.addIndex(
        'user_notification_sender',
        ['recipient', 'sender_id'],
        {
          name: 'user_notification_sender_recipient_sender_id_uncategorized_idx',
          unique: true,
          where: { category: null },
          transaction,
        },
      )

      await queryInterface.createTable(
        'notification_category',
        {
          category: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
          },
          label: {
            type: Sequelize.JSONB,
            allowNull: false,
          },
        },
        { transaction },
      )

      // Backfill from existing notifications, normalizing sender ids to digits
      // only. Categories are not known for existing notifications, so they are
      // all uncategorized.
      await queryInterface.sequelize.query(
        `
        INSERT INTO user_notification_sender
          (recipient, sender_id, category)
        SELECT DISTINCT
          recipient,
          regexp_replace(sender_id, '\\D', '', 'g'),
          NULL
        FROM user_notification
        WHERE sender_id IS NOT NULL
          AND regexp_replace(sender_id, '\\D', '', 'g') ~ '^\\d{10}$'
        ON CONFLICT DO NOTHING
        `,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('notification_category', { transaction })
      await queryInterface.dropTable('user_notification_sender', {
        transaction,
      })
    })
  },
}
