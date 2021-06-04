'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'accused_plea',
          'accused_plea_announcement',
          {
            transaction: t,
          },
        ),
        queryInterface.addColumn(
          'case',
          'accused_plea_decision',
          {
            type: Sequelize.ENUM('ACCEPT', 'REJECT'),
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'accused_plea_announcement',
          'accused_plea',
          {
            transaction: t,
          },
        ),
        queryInterface
          .removeColumn('case', 'accused_plea_decision', {
            transaction: t,
          })
          .then(() =>
            queryInterface.sequelize.query(
              'DROP TYPE IF EXISTS "enum_case_accused_plea_decision";',
              { transaction: t },
            ),
          ),
      ]),
    )
  },
}
