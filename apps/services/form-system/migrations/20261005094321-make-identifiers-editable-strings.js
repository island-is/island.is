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

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      for (const table of ['screen', 'field']) {
        await queryInterface.sequelize.query(
          `ALTER TABLE "${table}" ALTER COLUMN "identifier" TYPE UUID USING "identifier"::uuid`,
          { transaction },
        )
      }
    })
  },
}
