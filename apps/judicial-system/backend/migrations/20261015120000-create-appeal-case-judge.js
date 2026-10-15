'use strict'

// Moves the judges of an appeal case from the three fixed columns
// appeal_judge1_id..3_id on appeal_case into appeal_case_judge: one row per
// judge, ordered by display_order, with the presiding judge at 0.
//
// The backfill is a single statement so that a legacy row naming the same
// judge in two slots (nothing ever prevented it) does not trip the unique
// constraint: the first slot wins. ON CONFLICT DO NOTHING keeps it idempotent,
// so the follow-up migration that drops the old columns can run it again to
// pick up rows written by old pods during the rollout.
//
// The old columns stay in place for now; they are nullable, so new code that
// no longer writes them keeps inserting fine.
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'appeal_case_judge',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          created: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          appeal_case_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: 'appeal_case', key: 'id' },
            onDelete: 'CASCADE',
          },
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: 'user', key: 'id' },
          },
          display_order: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
        },
        { transaction },
      )

      await queryInterface.addIndex('appeal_case_judge', ['appeal_case_id'], {
        name: 'appeal_case_judge_appeal_case_id_idx',
        transaction,
      })

      await queryInterface.addConstraint('appeal_case_judge', {
        fields: ['appeal_case_id', 'user_id'],
        type: 'unique',
        name: 'appeal_case_judge_appeal_case_id_user_id_uq',
        transaction,
      })

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
         ) deduplicated
         WHERE rn = 1
         ON CONFLICT DO NOTHING`,
        { transaction },
      )
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('appeal_case_judge')
  },
}
