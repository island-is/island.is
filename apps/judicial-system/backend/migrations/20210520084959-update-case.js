'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'court_case_facts',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'court_legal_arguments',
          {
            type: Sequelize.TEXT,
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
        queryInterface.removeColumn('case', 'court_case_facts', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'court_legal_arguments', {
          transaction: t,
        }),
      ]),
    )
  },
}
