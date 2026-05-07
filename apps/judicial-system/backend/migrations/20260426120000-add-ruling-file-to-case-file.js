'use strict'

// Adds a self-referencing ruling_file_id column to case_file.
//
// When an appeal-related case file (brief, statement, etc.) is uploaded as
// part of a ruling-order appeal, ruling_file_id is set to the id of the
// COURT_INDICTMENT_RULING_ORDER case file being appealed — the same id that
// the matching appeal_case row stores in its own ruling_file_id column. The
// frontend then groups appeal-related files per ruling-order appeal by that
// shared id.
//
// For case-level appeals the column stays NULL — files continue to be
// scoped by category alone, exactly as before.
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'case_file',
        'ruling_file_id',
        {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'case_file', key: 'id' },
          onUpdate: 'NO ACTION',
          onDelete: 'NO ACTION',
        },
        { transaction },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('case_file', 'ruling_file_id', {
        transaction,
      }),
    )
  },
}
