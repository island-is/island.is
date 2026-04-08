'use strict'
/* eslint-env node */

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      // Table for linking scopes to service categories (Þjónustuflokkar)
      await queryInterface.createTable(
        'api_scope_category',
        {
          scope_name: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'api_scope',
              key: 'name',
            },
            onDelete: 'CASCADE',
          },
          category_id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: {
            type: Sequelize.DATE,
          },
        },
        { transaction },
      )

      // Index for reverse lookups (find scopes by category)
      await queryInterface.addIndex('api_scope_category', ['category_id'], {
        name: 'idx_api_scope_category_category_id',
        transaction,
      })

      // Table for linking scopes to tags (currently Lífsviðburðir/life events)
      await queryInterface.createTable(
        'api_scope_tag',
        {
          scope_name: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'api_scope',
              key: 'name',
            },
            onDelete: 'CASCADE',
          },
          tag_id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: {
            type: Sequelize.DATE,
          },
        },
        { transaction },
      )

      // Index for reverse lookups (find scopes by tag)
      await queryInterface.addIndex('api_scope_tag', ['tag_id'], {
        name: 'idx_api_scope_tag_tag_id',
        transaction,
      })
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('api_scope_tag', { transaction })
      await queryInterface.dropTable('api_scope_category', { transaction })
    })
  },
}
