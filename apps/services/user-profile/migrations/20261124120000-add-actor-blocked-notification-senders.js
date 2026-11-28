'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'actor_blocked_notification_senders',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          actor_profile_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'actor_profile',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          sender_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          created: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
        },
        { transaction },
      )

      // A sender can only be blocked once per actor profile
      await queryInterface.addIndex(
        'actor_blocked_notification_senders',
        ['actor_profile_id', 'sender_id'],
        {
          // Postgres truncates identifiers longer than 63 characters
          name: 'actor_blocked_notification_senders_profile_sender_unique',
          unique: true,
          transaction,
        },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('actor_blocked_notification_senders', {
        transaction,
      })
    })
  },
}
