'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'application_events',
          'staff_name',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'application_events',
          'staff_national_id',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application_events', 'staff_name', {
          transaction: t,
        }),
        queryInterface.removeColumn('application_events', 'staff_national_id', {
          transaction: t,
        }),
      ]),
    )
  },
}
