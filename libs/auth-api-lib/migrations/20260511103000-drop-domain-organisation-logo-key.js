'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('domain', 'organisation_logo_key', {
        transaction,
      })
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
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
}
