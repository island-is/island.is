'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'application_files',
          'type',
          {
            type: Sequelize.ENUM('Income', 'TaxReturn', 'Other'),
            allowNull: false,
            defaultValue: 'Other',
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application_files', 'type', {
          transaction: t,
        }),
      ]),
    )
  },
}
