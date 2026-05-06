'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'application_translation',
        'draft_value_is',
        { type: Sequelize.TEXT, allowNull: true },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'application_translation',
        'draft_value_en',
        { type: Sequelize.TEXT, allowNull: true },
        { transaction: t },
      )

      await queryInterface.createTable(
        'application_translation_publish',
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
          published_by: {
            type: Sequelize.STRING(20),
            allowNull: true,
          },
          published_at: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          note: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
        },
        { transaction: t },
      )

      await queryInterface.addIndex(
        'application_translation_publish',
        ['namespace'],
        {
          name: 'application_translation_publish_namespace_idx',
          transaction: t,
        },
      )

      await queryInterface.createTable(
        'application_translation_publish_snapshot',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          publish_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'application_translation_publish',
              key: 'id',
            },
            onDelete: 'CASCADE',
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
        },
        { transaction: t },
      )

      await queryInterface.addIndex(
        'application_translation_publish_snapshot',
        ['publish_id'],
        {
          name: 'application_translation_publish_snapshot_publish_id_idx',
          transaction: t,
        },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable(
        'application_translation_publish_snapshot',
        { transaction: t },
      )
      await queryInterface.dropTable('application_translation_publish', {
        transaction: t,
      })
      await queryInterface.removeColumn(
        'application_translation',
        'draft_value_en',
        { transaction: t },
      )
      await queryInterface.removeColumn(
        'application_translation',
        'draft_value_is',
        { transaction: t },
      )
    })
  },
}
