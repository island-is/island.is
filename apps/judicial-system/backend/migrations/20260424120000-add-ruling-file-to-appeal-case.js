'use strict'

// Extends appeal_case to support ruling-order appeals (Úrskurður undir rekstri máls).
// Existing case-level appeals have ruling_file_id = NULL; ruling-order appeals set it.
// The composite UNIQUE uses NULLS NOT DISTINCT (PG15+) so the constraint covers both
// "at most one case-level appeal per case" and "at most one appeal per (case, file) pair".
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .removeConstraint('appeal_case', 'appeal_case_case_id_key', {
          transaction,
        })
        .then(() =>
          queryInterface.addColumn(
            'appeal_case',
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
        .then(() =>
          queryInterface.sequelize.query(
            `CREATE UNIQUE INDEX appeal_case_case_id_ruling_file_id_uq
               ON appeal_case (case_id, ruling_file_id)
               NULLS NOT DISTINCT`,
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize
        .query('DROP INDEX IF EXISTS appeal_case_case_id_ruling_file_id_uq', {
          transaction,
        })
        .then(() =>
          queryInterface.removeColumn('appeal_case', 'ruling_file_id', {
            transaction,
          }),
        )
        .then(() =>
          queryInterface.addConstraint('appeal_case', {
            fields: ['case_id'],
            type: 'unique',
            name: 'appeal_case_case_id_key',
            transaction,
          }),
        ),
    )
  },
}
