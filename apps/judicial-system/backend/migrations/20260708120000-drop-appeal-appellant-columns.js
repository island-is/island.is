'use strict'

// Drop the legacy appellant columns now that the appellant identity is
// read from the APPEALED event log (who) and the appeal timing from
// appeal_case.appeal_date (when):
//   - case.accused_postponed_appeal_date / case.prosecutor_postponed_appeal_date
//   - appeal_case.appealed_by_national_id
//
// This ships only after the event-log read switch (appeal-in-court stack) is in
// production and verified (every appeal has an APPEALED event), so the dual-write
// and the getLegacyAppealedByRole fallback that used these columns are gone.
//
// Straight drop - the data these held is fully represented in the new model, so
// no backup table is kept. The down migration re-adds the columns empty (the
// original values are not restorable); rollback of the feature relies on the new
// model, not on these columns.

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn(
        'case',
        'accused_postponed_appeal_date',
        { transaction },
      )
      await queryInterface.removeColumn(
        'case',
        'prosecutor_postponed_appeal_date',
        { transaction },
      )
      await queryInterface.removeColumn(
        'appeal_case',
        'appealed_by_national_id',
        { transaction },
      )
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'case',
        'accused_postponed_appeal_date',
        { type: Sequelize.DATE, allowNull: true },
        { transaction },
      )
      await queryInterface.addColumn(
        'case',
        'prosecutor_postponed_appeal_date',
        { type: Sequelize.DATE, allowNull: true },
        { transaction },
      )
      await queryInterface.addColumn(
        'appeal_case',
        'appealed_by_national_id',
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      )
    }),
}
