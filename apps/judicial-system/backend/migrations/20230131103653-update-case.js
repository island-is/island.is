'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'indictment_introduction',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('case', 'indictment_introduction', {
          transaction: t,
        }),
      ]),
    )
  },
}
