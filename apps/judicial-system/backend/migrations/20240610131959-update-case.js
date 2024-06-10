'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'subpoena_type',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'subpoena_type', {
        transaction: t,
      }),
    )
  },
}
