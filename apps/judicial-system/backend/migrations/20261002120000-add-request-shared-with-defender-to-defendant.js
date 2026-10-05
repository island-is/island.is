'use strict'

// Phase 3.5 PR1: per-defendant requestSharedWithDefender for request cases.
//
// Adds a nullable string column on defendant (same values as
// case.request_shared_with_defender) and backfills from the case row so the
// dual-write in application code has correct data for existing cases.
// Access still reads the case column until a later PR flips readers.

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'defendant',
        'request_shared_with_defender',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      )

      // Case column is still a Postgres enum; cast to text to write into the
      // defendant string column.
      await queryInterface.sequelize.query(
        `UPDATE defendant d
         SET request_shared_with_defender = c.request_shared_with_defender::text
         FROM "case" c
         WHERE d.case_id = c.id
           AND c.type <> 'INDICTMENT'
           AND c.state <> 'DELETED'`,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn(
        'defendant',
        'request_shared_with_defender',
        { transaction },
      )
    })
  },
}
