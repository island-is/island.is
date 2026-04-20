'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.sequelize
          .query('DELETE FROM court_document', { transaction })
          .then(() =>
            queryInterface.sequelize.query('DELETE FROM court_session', {
              transaction,
            }),
          ),
        queryInterface.addColumn(
          'case',
          'with_court_sessions',
          { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          { transaction },
        ),
      ]),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('case', 'with_court_sessions', {
        transaction,
      }),
    )
  },
}
