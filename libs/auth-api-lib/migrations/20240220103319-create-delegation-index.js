'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'delegation_index',
        {
          from_national_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          to_national_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          provider: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          custom_delegation_scopes: {
            type: Sequelize.ARRAY(Sequelize.STRING),
          },
          valid_to: {
            type: Sequelize.DATE,
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

      await queryInterface.createTable(
        'delegation_index_meta',
        {
          national_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          last_full_reindex: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          next_reindex: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('delegation_index_meta', { transaction })
      await queryInterface.dropTable('delegation_index', { transaction })
    })
  },
}
