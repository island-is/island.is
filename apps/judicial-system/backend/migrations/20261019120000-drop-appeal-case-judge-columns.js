'use strict'

// Drops the three fixed judge columns appeal_judge1_id..3_id from appeal_case.
// The bench lives in appeal_case_judge since 20261015120000, and nothing has
// read or written the columns since the release that introduced the table.
//
// The backfill of that migration runs once more before the columns go, for the
// appeal cases that have no bench rows. The release that introduced the table
// rolled out while pods of the previous release were still writing the
// columns, so a judge assigned during that rollout exists only there. The
// rerun is limited to appeal cases without rows on purpose: a bench written by
// the new code has superseded its columns, which nothing updated afterwards,
// and merging the two would seat a stale judge on a live bench.
//
// Rolling back recreates the columns and hands the bench back to them the way
// the earlier migration's down does: the first three judges in bench order,
// so the old code finds the bench where it looks for it.
const columns = ['appeal_judge1_id', 'appeal_judge2_id', 'appeal_judge3_id']

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `INSERT INTO appeal_case_judge
           (id, created, modified, appeal_case_id, user_id, display_order)
         SELECT gen_random_uuid(), NOW(), NOW(), appeal_case_id, user_id, slot
         FROM (
           SELECT appeal_case_id, user_id, slot,
                  ROW_NUMBER() OVER (
                    PARTITION BY appeal_case_id, user_id ORDER BY slot
                  ) AS rn
           FROM (
             SELECT id AS appeal_case_id, appeal_judge1_id AS user_id, 0 AS slot
             FROM appeal_case WHERE appeal_judge1_id IS NOT NULL
             UNION ALL
             SELECT id, appeal_judge2_id, 1
             FROM appeal_case WHERE appeal_judge2_id IS NOT NULL
             UNION ALL
             SELECT id, appeal_judge3_id, 2
             FROM appeal_case WHERE appeal_judge3_id IS NOT NULL
           ) slots
           WHERE NOT EXISTS (
             SELECT 1 FROM appeal_case_judge existing
             WHERE existing.appeal_case_id = slots.appeal_case_id
           )
         ) deduplicated
         WHERE rn = 1
         ON CONFLICT DO NOTHING`,
        { transaction },
      )

      for (const column of columns) {
        await queryInterface.removeColumn('appeal_case', column, {
          transaction,
        })
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      for (const column of columns) {
        await queryInterface.addColumn(
          'appeal_case',
          column,
          {
            type: Sequelize.UUID,
            references: { model: 'user', key: 'id' },
            allowNull: true,
          },
          { transaction },
        )
      }

      await queryInterface.sequelize.query(
        `UPDATE appeal_case ac
         SET appeal_judge1_id = bench.judge1,
             appeal_judge2_id = bench.judge2,
             appeal_judge3_id = bench.judge3
         FROM (
           SELECT ac.id,
                  (ARRAY_AGG(j.user_id ORDER BY j.display_order, j.created, j.id))[1] AS judge1,
                  (ARRAY_AGG(j.user_id ORDER BY j.display_order, j.created, j.id))[2] AS judge2,
                  (ARRAY_AGG(j.user_id ORDER BY j.display_order, j.created, j.id))[3] AS judge3
           FROM appeal_case ac
           LEFT JOIN appeal_case_judge j ON j.appeal_case_id = ac.id
           GROUP BY ac.id
         ) bench
         WHERE bench.id = ac.id`,
        { transaction },
      )
    })
  },
}
