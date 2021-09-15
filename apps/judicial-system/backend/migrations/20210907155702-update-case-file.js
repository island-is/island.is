'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case_file',
          'state',
          {
            type: Sequelize.ENUM(
              'STORED_IN_RVG',
              'STORED_IN_COURT',
              'BOKEN_LINK',
              'DELETED',
            ),
            allowNull: false,
            defaultValue: 'STORED_IN_RVG',
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case_file',
          'type',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'application/pdf',
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface
          .removeColumn('case_file', 'state', {
            transaction: t,
          })
          .then(() =>
            queryInterface.sequelize.query(
              'DROP TYPE IF EXISTS "enum_case_file_state"',
              { transaction: t },
            ),
          ),
        queryInterface.removeColumn('case_file', 'type', {
          transaction: t,
        }),
      ]),
    )
  },
}
