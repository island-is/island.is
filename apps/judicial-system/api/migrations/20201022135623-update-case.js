'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.sequelize.query(
          `UPDATE "case" SET "case_facts" = COALESCE("case_facts", '') || '\n\n' || COALESCE("witness_accounts", '') || '\n\n' || COALESCE("investigation_progress", '')`,
          { transaction: t },
        ),
        queryInterface.removeColumn('case', 'witness_accounts', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'investigation_progress', {
          transaction: t,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'witness_accounts',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'investigation_progress',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },
}
