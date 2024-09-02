'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'case',
        'court_session_type',
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
      queryInterface.removeColumn('case', 'court_session_type', {
        transaction,
      }),
    )
  },
}
