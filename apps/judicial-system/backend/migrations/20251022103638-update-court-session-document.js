'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'court_document',
        'submitted_by',
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('court_document', 'submitted_by', {
        transaction,
      }),
    )
  },
}
