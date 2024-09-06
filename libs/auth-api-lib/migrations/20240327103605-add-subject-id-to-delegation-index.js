'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'delegation_index',
        'subject_id',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('delegation_index', 'subject_id', {
        transaction,
      })
    })
  },
}
