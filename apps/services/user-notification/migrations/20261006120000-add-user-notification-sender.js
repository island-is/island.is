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
          template_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          // Slugified Icelandic HnippCategory, null when the template has no
          // category, which is presented as 'almennt'. Updated on every send,
          // since a template's category can change.
          category: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          // Latest priority type of the template, updated on every send
          priority_type: {
            type: Sequelize.ENUM('Informative', 'Actionable'),
            allowNull: true,
          },
        },
        { transaction },
      )

      await queryInterface.addIndex(
        'user_notification_sender',
        ['recipient', 'sender_id', 'template_id'],
        {
          name: 'user_notification_sender_recipient_sender_id_template_id_idx',
          unique: true,
          transaction,
        },
      )

      // Backfill from existing notifications, normalizing sender ids to digits
      // only and taking the priority type of the latest notification of each
      // template. Categories are not known for existing notifications, so they
      // stay uncategorized until the template is sent again.
      await queryInterface.sequelize.query(
        `
        INSERT INTO user_notification_sender
          (recipient, sender_id, template_id, category, priority_type)
        SELECT DISTINCT ON (recipient, normalized_sender_id, template_id)
          recipient,
          normalized_sender_id,
          template_id,
          NULL,
          priority_type::text::enum_user_notification_sender_priority_type
        FROM (
          SELECT
            recipient,
            regexp_replace(sender_id, '\\D', '', 'g') AS normalized_sender_id,
            template_id,
            priority_type,
            created
          FROM user_notification
          WHERE sender_id IS NOT NULL
        ) notifications
        WHERE normalized_sender_id ~ '^\\d{10}$'
        ORDER BY recipient, normalized_sender_id, template_id, created DESC
        ON CONFLICT DO NOTHING
        `,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('user_notification_sender', {
        transaction,
      })
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_user_notification_sender_priority_type";',
        { transaction },
      )
    })
  },
}
