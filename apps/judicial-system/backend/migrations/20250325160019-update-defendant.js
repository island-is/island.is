'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'defendant',
          'date_of_birth',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },
  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('defendant', 'date_of_birth', {
        transaction: t,
      }),
    )
  },
}
