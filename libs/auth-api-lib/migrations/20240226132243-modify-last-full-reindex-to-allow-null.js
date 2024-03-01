'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'delegation_index_meta',
        'last_full_reindex',
        {
          type: Sequelize.DATE,
          allowNull: true,
          transaction,
        },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'delegation_index_meta',
        'last_full_reindex',
        {
          allowNull: false,
          transaction,
        },
      )
    })
  },
}
