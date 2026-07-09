'use strict'

// Drop the legacy in-court appeal-decision + announcement columns. The
// in-court "Ákvörðun um kæru" is stored on the case-level appeal_decision rows
// (ruling_file_id NULL) - the source of truth - and the case interceptor now
// projects these fields from those rows, so the columns are redundant:
//   - case.accused_appeal_decision / case.accused_appeal_announcement
//   - case.prosecutor_appeal_decision / case.prosecutor_appeal_announcement
//
// Ships after the appeal-decision write switch is in production (writes go to
// the rows via the updateCaseAppealDecision mutation). Straight drop - the data
// lives in the new model; the down migration re-adds the columns empty (the
// original values are not restorable).
//
// Both decision columns share the enum type enum_case_appeal_decision and nothing
// else uses it, so it is dropped with them.

const APPEAL_DECISION_VALUES = [
  'APPEAL',
  'ACCEPT',
  'POSTPONE',
  'NOT_APPLICABLE',
]

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('case', 'accused_appeal_decision', {
        transaction,
      })
      await queryInterface.removeColumn('case', 'accused_appeal_announcement', {
        transaction,
      })
      await queryInterface.removeColumn('case', 'prosecutor_appeal_decision', {
        transaction,
      })
      await queryInterface.removeColumn(
        'case',
        'prosecutor_appeal_announcement',
        { transaction },
      )
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_case_appeal_decision"',
        { transaction },
      )
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'case',
        'accused_appeal_decision',
        { type: Sequelize.ENUM(...APPEAL_DECISION_VALUES), allowNull: true },
        { transaction },
      )
      await queryInterface.addColumn(
        'case',
        'accused_appeal_announcement',
        { type: Sequelize.TEXT, allowNull: true },
        { transaction },
      )
      await queryInterface.addColumn(
        'case',
        'prosecutor_appeal_decision',
        { type: Sequelize.ENUM(...APPEAL_DECISION_VALUES), allowNull: true },
        { transaction },
      )
      await queryInterface.addColumn(
        'case',
        'prosecutor_appeal_announcement',
        { type: Sequelize.TEXT, allowNull: true },
        { transaction },
      )
    }),
}
