'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'case_file',
        'display_date',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        {
          transaction,
        },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('case_file', 'display_date', {
        transaction,
      }),
    )
  },
}
