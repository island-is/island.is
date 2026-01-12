'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('form_url', { transaction: t })
      await queryInterface.dropTable('organization_url', { transaction: t })
    })
  },

  async down(queryInterface, Sequelize) {
    // Recreate organization_url, then form_url
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'organization_url',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
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
          url: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          method: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          is_xroad: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          is_test: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          organization_id: {
            type: Sequelize.UUID,
            onDelete: 'CASCADE',
            allowNull: false,
            references: {
              model: 'organization',
              key: 'id',
            },
          },
        },
        { transaction: t },
      )

      await queryInterface.createTable(
        'form_url',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
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
          organization_url_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'organization_url',
              key: 'id',
            },
          },
          form_id: {
            type: Sequelize.UUID,
            onDelete: 'CASCADE',
            allowNull: false,
            references: {
              model: 'form',
              key: 'id',
            },
          },
        },
        { transaction: t },
      )
    })
  },
}
