'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'case',
          'police_case_number',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'MISSING',
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'suspect_national_id',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'MISSING',
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'suspect_name',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'MISSING',
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'state',
          {
            type: Sequelize.ENUM(
              'UNKNOWN',
              'DRAFT',
              'SUBMITTED',
              'ACTIVE',
              'COMPLETED',
            ),
            allowNull: false,
            defaultValue: 'DRAFT',
          },
          { transaction: t },
        ),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('case', 'police_case_number', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'suspect_national_id', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'suspect_name', { transaction: t }),
        queryInterface
          .removeColumn('case', 'state', { transaction: t })
          .then(() =>
            queryInterface.sequelize.query(
              'DROP TYPE IF EXISTS "enum_case_state";',
              { transaction: t },
            ),
          ),
      ])
    })
  },
}
