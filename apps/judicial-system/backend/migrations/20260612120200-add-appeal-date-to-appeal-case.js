'use strict'

// Adds the canonical time-of-appeal column. `created` is meaningless for
// case-level rows backfilled by 20260321200000 (it got NOW() at migration
// time), so appeal_date is computed from the legacy case columns:
//   - per side, the effective appeal time is
//       NULL                                       if decision = ACCEPT (void),
//       ruling_date (fallback court_end_time)      if decision = APPEAL (appealed in court),
//       *_postponed_appeal_date                    otherwise (appealed later);
//   - prosecutor time wins on conflict, accused time second,
//     `created` is the last resort for rows with no usable source.
// Ruling-order rows were created at the moment of appeal, so created is genuine.
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .addColumn(
          'appeal_case',
          'appeal_date',
          { type: Sequelize.DATE, allowNull: true },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE appeal_case ac
               SET appeal_date = COALESCE(
                 CASE
                   WHEN c.prosecutor_appeal_decision = 'ACCEPT' THEN NULL
                   WHEN c.prosecutor_appeal_decision = 'APPEAL'
                     THEN COALESCE(c.ruling_date, c.court_end_time)
                   ELSE c.prosecutor_postponed_appeal_date
                 END,
                 CASE
                   WHEN c.accused_appeal_decision = 'ACCEPT' THEN NULL
                   WHEN c.accused_appeal_decision = 'APPEAL'
                     THEN COALESCE(c.ruling_date, c.court_end_time)
                   ELSE c.accused_postponed_appeal_date
                 END,
                 ac.created)
               FROM "case" c
               WHERE c.id = ac.case_id AND ac.ruling_file_id IS NULL`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE appeal_case
               SET appeal_date = created
               WHERE ruling_file_id IS NOT NULL`,
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('appeal_case', 'appeal_date', {
        transaction,
      }),
    )
  },
}
