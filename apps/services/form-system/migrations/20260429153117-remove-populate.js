'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const formTable = await queryInterface.describeTable('form')
      if (formTable.use_populate) {
        await queryInterface.removeColumn('form', 'use_populate', {
          transaction,
        })
      }

      const screenTable = await queryInterface.describeTable('screen')
      if (screenTable.should_populate) {
        await queryInterface.removeColumn('screen', 'should_populate', {
          transaction,
        })
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const formTable = await queryInterface.describeTable('form')
      if (!formTable.use_populate) {
        await queryInterface.addColumn(
          'form',
          'use_populate',
          { type: Sequelize.BOOLEAN, defaultValue: false },
          { transaction },
        )
      }

      const screenTable = await queryInterface.describeTable('screen')
      if (!screenTable.should_populate) {
        await queryInterface.addColumn(
          'screen',
          'should_populate',
          { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          { transaction },
        )
      }
    })
  },
}
