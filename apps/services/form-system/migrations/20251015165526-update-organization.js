'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('organization', 'name', { transaction })
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'organization',
        'name',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      )
    })
  },
}
