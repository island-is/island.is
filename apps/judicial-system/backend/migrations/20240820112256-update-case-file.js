'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'case_file',
        'submitted_by',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('file', 'submitted_by', {
        transaction,
      }),
    )
  },
}
