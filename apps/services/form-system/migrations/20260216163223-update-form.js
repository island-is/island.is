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
      if (!table.use_validate) {
        await queryInterface.addColumn(
          'form',
          'use_validate',
          { type: Sequelize.BOOLEAN, defaultValue: false },
          { transaction },
        )
      }
      if (!table.use_populate) {
        await queryInterface.addColumn(
          'form',
          'use_populate',
          { type: Sequelize.BOOLEAN, defaultValue: false },
          { transaction },
        )
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
      if (table.use_validate) {
        await queryInterface.removeColumn('form', 'use_validate', {
          transaction,
        })
      }
      if (table.use_populate) {
        await queryInterface.removeColumn('form', 'use_populate', {
          transaction,
        })
      }
    })
  },
}
