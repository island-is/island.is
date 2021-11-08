'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'applications',
          'family_status',
          {
            type: Sequelize.ENUM(
              'NotCohabitation',
              'Cohabitation',
              'UnregisteredCohabitation',
              'Married',
              'MarriedNotLivingTogether',
            ),
            allowNull: false,
            defaultValue: 'NotCohabitation',
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
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
      ]),
    )
  },
}
