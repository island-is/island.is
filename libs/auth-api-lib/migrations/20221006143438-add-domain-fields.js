'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'domain',
        'display_name',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'Mínar síður Ísland.is',
        },
        { transaction },
      )

      await queryInterface.addColumn(
        'domain',
        'organisation_logo_key',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'Stafrænt Ísland',
        },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('domain', 'display_name', {
        transaction,
      })
      await queryInterface.removeColumn('domain', 'organisation_logo_key', {
        transaction,
      })
    })
  },
}
