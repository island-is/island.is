'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'notification_sender_setting',
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
          enabled: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false,
          },
          seen: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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

      // Avoid duplicate entries per sender
      await queryInterface.addIndex(
        'notification_sender_setting',
        ['national_id', 'sender_id'],
        {
          name: 'notification_sender_setting_national_id_sender_id_unique',
          unique: true,
          transaction,
        },
      )

      await queryInterface.addColumn(
        'user_profile',
        'notification_senders_initialized_at',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('notification_sender_setting', {
        transaction,
      })
      await queryInterface.removeColumn(
        'user_profile',
        'notification_senders_initialized_at',
        { transaction },
      )
    })
  },
}
