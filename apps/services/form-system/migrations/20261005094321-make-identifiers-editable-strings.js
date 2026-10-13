'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      for (const table of ['screen', 'field']) {
        await queryInterface.changeColumn(
          table,
          'identifier',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction },
        )
      }
    })
  },

  async down() {
    throw new Error(
      'This migration is irreversible: custom identifiers cannot be converted back to UUIDs and the original values are not preserved.',
    )
  },
}
