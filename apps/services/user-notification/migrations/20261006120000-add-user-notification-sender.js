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
        },
        { transaction },
      )

      await queryInterface.addIndex(
        'user_notification_sender',
        ['recipient', 'sender_id'],
        {
          name: 'user_notification_sender_recipient_sender_id_idx',
          unique: true,
          transaction,
        },
      )

      // Backfill from existing notifications, normalizing sender ids to digits only
      await queryInterface.sequelize.query(
        `
        INSERT INTO user_notification_sender
          (recipient, sender_id)
        SELECT DISTINCT
          recipient,
          regexp_replace(sender_id, '\\D', '', 'g')
        FROM user_notification
        WHERE sender_id IS NOT NULL
          AND regexp_replace(sender_id, '\\D', '', 'g') <> ''
        ON CONFLICT DO NOTHING
        `,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_notification_sender')
  },
}
