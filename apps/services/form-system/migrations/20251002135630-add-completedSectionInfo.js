'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('form', 'completed_message', {
        transaction,
      })

      await queryInterface.addColumn(
        'form',
        'completed_section_info',
        {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: {},
        },
        { transaction },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('form', 'completed_section_info', {
        transaction,
      })

      await queryInterface.addColumn(
        'form',
        'completed_message',
        {
          type: Sequelize.JSON,
          allowNull: true,
        },
        { transaction },
      )
    })
  },
}
