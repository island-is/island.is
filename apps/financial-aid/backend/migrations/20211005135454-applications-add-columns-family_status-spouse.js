'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'applications',
          'family_status',
          {
            type: Sequelize.ENUM(
              'Unknown',
              'Single',
              'Cohabitation',
              'UnregisteredCohabitation',
              'Married',
              'MarriedNotLivingTogether',
              'NotInformed',
            ),
            allowNull: false,
            defaultValue: 'Unknown',
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'spouse_national_id',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'spouse_email',
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
        queryInterface.removeColumn('applications', 'family_status', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'spouse_national_id', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'spouse_email', {
          transaction: t,
        }),
      ]),
    )
  },
}
