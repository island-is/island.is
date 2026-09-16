'use strict'

// A court document brought in from a case merged into this one used to be the
// merged case's own row, doing double duty through merged_court_session_id and
// merged_document_order. It is now a copy that belongs to the parent case, and
// this column names the case it was copied from.
//
// Schema only - the data migration that creates the copies is the next one.
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'court_document',
        'merged_from_case_id',
        {
          type: Sequelize.UUID,
          references: { model: 'case', key: 'id' },
          allowNull: true,
        },
        { transaction },
      ),
    ),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('court_document', 'merged_from_case_id', {
        transaction,
      }),
    ),
}
