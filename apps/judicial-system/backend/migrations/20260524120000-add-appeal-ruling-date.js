'use strict'

// Adds appeal_ruling_date to appeal_case. Going forward it is set when the court
// of appeals completes an appeal (COMPLETE_APPEAL transition), so the completion
// date is available immediately instead of depending on the asynchronously created
// APPEAL_COMPLETED notification. Existing completed appeals are backfilled from the
// first APPEAL_COMPLETED notification on the case.
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .addColumn(
          'appeal_case',
          'appeal_ruling_date',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE appeal_case AS ac
               SET appeal_ruling_date = n.created
               FROM (
                 SELECT case_id, MIN(created) AS created
                 FROM notification
                 WHERE type = 'APPEAL_COMPLETED'
                 GROUP BY case_id
               ) AS n
               WHERE ac.case_id = n.case_id
                 AND ac.appeal_state = 'COMPLETED'
                 AND ac.appeal_ruling_date IS NULL`,
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('appeal_case', 'appeal_ruling_date')
  },
}
