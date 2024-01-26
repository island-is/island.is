'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'defendant_plea',
        {
          type: Sequelize.ENUM('GUILITY', 'NOT_GUILTY', 'NO_PLEA'),
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'defendant_plea', {
        transaction: t,
      }),
    )
  },
}
