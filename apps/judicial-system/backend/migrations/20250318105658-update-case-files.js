'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case_file',
          'file_representative',
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
      queryInterface.removeColumn('case_file', 'file_representative', {
        transaction: t,
      }),
    )
  },
}
