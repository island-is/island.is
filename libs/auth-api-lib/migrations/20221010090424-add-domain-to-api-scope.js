'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'api_scope',
        'domain_name',
        {
          type: Sequelize.STRING,
          allowNull: true,
          references: { model: 'domain', key: 'name' },
        },
        { transaction },
      )

      await queryInterface.sequelize.query(
        `UPDATE api_scope SET domain_name = (SELECT domain_name FROM api_scope_group WHERE id = api_scope.group_id);`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `UPDATE api_scope SET domain_name = '@island.is' where domain_name IS NULL;`,
        { transaction },
      )

      await queryInterface.changeColumn(
        'api_scope',
        'domain_name',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '@island.is',
        },
        { transaction },
      )

      await queryInterface.addIndex('api_scope', ['domain_name'], {
        transaction,
      })
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('api_scope', 'domain_name', {
        transaction,
      })
    })
  },
}
