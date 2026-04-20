'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'application_translation',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          namespace: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          message_key: {
            type: Sequelize.STRING(512),
            allowNull: false,
          },
          value_is: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          value_en: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          default_message: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          is_reviewed: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          translated_by: {
            type: Sequelize.STRING(20),
            allowNull: true,
          },
          reviewed_by: {
            type: Sequelize.STRING(20),
            allowNull: true,
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
        { transaction: t },
      )

      await queryInterface.addConstraint('application_translation', {
        fields: ['namespace', 'message_key'],
        type: 'unique',
        name: 'application_translation_namespace_message_key_unique',
        transaction: t,
      })

      await queryInterface.addIndex(
        'application_translation',
        ['namespace'],
        {
          name: 'application_translation_namespace_idx',
          transaction: t,
        },
      )

      await queryInterface.createTable(
        'application_translation_log',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          translation_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'application_translation',
              key: 'id',
            },
            onDelete: 'CASCADE',
          },
          old_value: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          new_value: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          changed_by: {
            type: Sequelize.STRING(20),
            allowNull: true,
          },
          action: {
            type: Sequelize.STRING(50),
            allowNull: false,
          },
          created: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
        },
        { transaction: t },
      )

      await queryInterface.addIndex(
        'application_translation_log',
        ['translation_id'],
        {
          name: 'application_translation_log_translation_id_idx',
          transaction: t,
        },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('application_translation_log', {
        transaction: t,
      })
      await queryInterface.dropTable('application_translation', {
        transaction: t,
      })
    })
  },
}
