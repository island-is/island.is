'use strict'

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'subpoena',
        'hash',
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      ),
    )
  },

  down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('subpoena', 'hash', {
        transaction,
      }),
    )
  },
}
