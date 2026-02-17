'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const table = await queryInterface.describeTable('form')
      if (table.validation_service_url) {
        await queryInterface.removeColumn('form', 'validation_service_url', {
          transaction,
        })
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const table = await queryInterface.describeTable('form')
      if (!table.validation_service_url) {
        await queryInterface.addColumn(
          'form',
          'validation_service_url',
          { type: Sequelize.STRING },
          { transaction },
        )
      }
    })
  },
}
