'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'applications',
          'home_circumstances',
          {
            type: Sequelize.ENUM(
              'Unknown',
              'WithParents',
              'WithOthers',
              'OwnPlace',
              'RegisteredLease',
              'Other',
            ),
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'student',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'employment',
          {
            type: Sequelize.ENUM(
              'Working',
              'Unemployed',
              'CannotWork',
              'Other',
            ),
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'use_personal_tax_credit',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'has_income',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'bank_number',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'ledger',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'account_number',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'interview',
          {
            type: Sequelize.BOOLEAN,
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
        queryInterface.removeColumn('applications', 'home_circumstances', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'student', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'employment', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'has_income', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'use_personal_tax_credit', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'bank_number', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'ledger', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'account_number', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'interview', {
          transaction: t,
        }),
      ]),
    )
  },
}
