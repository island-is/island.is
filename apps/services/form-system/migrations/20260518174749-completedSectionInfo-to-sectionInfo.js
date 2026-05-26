'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn(
        'form',
        'completed_section_info',
        'section_info',
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn(
        'form',
        'section_info',
        'completed_section_info',
        { transaction },
      )
    })
  },
}
