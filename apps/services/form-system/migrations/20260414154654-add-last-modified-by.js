'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const table = await queryInterface.describeTable('form')
      if (!table.last_modified_by) {
        await queryInterface.addColumn(
          'form',
          'last_modified_by',
          { type: Sequelize.STRING, allowNull: true },
          { transaction },
        )
      }
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const table = await queryInterface.describeTable('form')
      if (table.last_modified_by) {
        await queryInterface.removeColumn('form', 'last_modified_by', {
          transaction,
        })
      }
    })
  },
}
