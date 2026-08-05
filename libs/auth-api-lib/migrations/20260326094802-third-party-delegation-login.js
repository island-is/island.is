'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'api_scope',
        'third_party_login_url',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
          comment: 'URL to redirect to for third party delegation login',
        },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('api_scope', 'third_party_login_url', {
        transaction,
      })
    })
  },
}
