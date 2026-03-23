'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('form', 'allowed_login_types', {
        transaction: t,
      })
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'form',
        'allowed_login_types',
        {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        { transaction: t },
      )
    })
  },
}
