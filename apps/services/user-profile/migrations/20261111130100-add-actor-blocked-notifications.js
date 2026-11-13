'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'actor_blocked_notifications',
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
          category: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          category_label: {
            type: Sequelize.JSONB,
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

      // A sender's category can only be blocked once per actor profile
      await queryInterface.addIndex(
        'actor_blocked_notifications',
        ['actor_profile_id', 'sender_id', 'category'],
        {
          name: 'actor_blocked_notifications_actor_profile_id_sender_id_category_unique',
          unique: true,
          transaction,
        },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('actor_blocked_notifications', {
        transaction,
      })
    })
  },
}
