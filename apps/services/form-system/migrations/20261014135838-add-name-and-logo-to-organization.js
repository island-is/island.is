'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'organization',
        'name',
        {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        { transaction },
      )
      await queryInterface.addColumn(
        'organization',
        'logo',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('organization', 'logo', { transaction })
      await queryInterface.removeColumn('organization', 'name', { transaction })
    })
  },
}
