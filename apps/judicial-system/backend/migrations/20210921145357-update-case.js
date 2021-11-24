'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'is_accused_absent',
          'is_accused_rights_hidden',
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'is_closed_court_hidden',
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
        queryInterface.renameColumn(
          'case',
          'is_accused_rights_hidden',
          'is_accused_absent',
          { transaction: t },
        ),
        queryInterface.removeColumn('case', 'is_closed_court_hidden', {
          transaction: t,
        }),
      ]),
    )
  },
}
