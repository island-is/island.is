'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface
          .addColumn(
            'case',
            'court_case_facts',
            {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            { transaction: t },
          )
          .then(() =>
            queryInterface.sequelize.query(
              `UPDATE "case" \
               SET "court_case_facts" = "case_facts"`,
              { transaction: t },
            ),
          ),
        queryInterface
          .addColumn(
            'case',
            'court_legal_arguments',
            {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            { transaction: t },
          )
          .then(() =>
            queryInterface.sequelize.query(
              `UPDATE "case" \
               SET "court_legal_arguments" = "legal_arguments"`,
              { transaction: t },
            ),
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
