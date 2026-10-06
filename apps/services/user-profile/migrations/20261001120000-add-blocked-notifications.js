'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'blocked_notifications',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          national_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
              model: 'user_profile',
              key: 'national_id',
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

      // A sender can only be blocked once per user
      await queryInterface.addIndex(
        'blocked_notifications',
        ['national_id', 'sender_id'],
        {
          name: 'blocked_notifications_national_id_sender_id_unique',
          unique: true,
          transaction,
        },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('blocked_notifications', { transaction })
    })
  },
}
