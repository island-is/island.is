'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'applications',
          'national_id',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'name',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'phone_number',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'email',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('applications', 'national_id', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'name', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'phone_number', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'email', {
          transaction: t,
        }),
      ]),
    )
  },
}
