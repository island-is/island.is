'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameColumn(
        'form',
        'allowed_delegation_types',
        'allowed_login_types',
        { transaction: t },
      )

      await queryInterface.sequelize.query(
        `UPDATE "form" SET "allowed_login_types" = '[]'::jsonb`,
        { transaction: t },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameColumn(
        'form',
        'allowed_login_types',
        'allowed_delegation_types',
        { transaction: t },
      )
    })
  },
}
