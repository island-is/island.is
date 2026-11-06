'use strict'

// Drop the reuse columns a merged case's own court documents used to be placed
// in the parent case's court session with:
//   - court_document.merged_court_session_id (and its foreign key to
//     court_session, which Postgres drops with the column)
//   - court_document.merged_document_order
//
// A merged document is now a copy that belongs to the parent case, named by
// court_document.merged_from_case_id, and nothing reads or writes these columns
// any more. This ships only after that code is in production and the columns
// were verified empty there.
//
// Straight drop - the columns hold no data, so no backup table is kept. The down
// migration re-adds them empty, with the foreign key, as they were created.

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn(
        'court_document',
        'merged_court_session_id',
        { transaction },
      )
      await queryInterface.removeColumn(
        'court_document',
        'merged_document_order',
        { transaction },
      )
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'court_document',
        'merged_document_order',
        { type: Sequelize.INTEGER, allowNull: true },
        { transaction },
      )
      await queryInterface.addColumn(
        'court_document',
        'merged_court_session_id',
        {
          type: Sequelize.UUID,
          references: { model: 'court_session', key: 'id' },
          allowNull: true,
        },
        { transaction },
      )
    }),
}
