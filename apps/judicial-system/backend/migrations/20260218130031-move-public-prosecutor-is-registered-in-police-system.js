'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
        INSERT INTO "defendant_event_log" (
          "id",
          "created",
          "modified",
          "case_id",
          "defendant_id",
          "event_type"
        )
        SELECT
          gen_random_uuid(),
          date_trunc('milliseconds', NOW()),
          date_trunc('milliseconds', NOW()),
          c."id",
          d."id",
          'PUBLIC_PROSECUTOR_REGISTERED_IN_POLICE_SYSTEM'
        FROM "case" c
        INNER JOIN "defendant" d ON d."case_id" = c."id"
        WHERE c."public_prosecutor_is_registered_in_police_system" = true
        `,
        { transaction: t },
      )

      await queryInterface.removeColumn(
        'case',
        'public_prosecutor_is_registered_in_police_system',
        { transaction: t },
      )
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'case',
        'public_prosecutor_is_registered_in_police_system',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction: t },
      )

      // Restore case field from defendant event log
      await queryInterface.sequelize.query(
        `
        UPDATE "case" c
        SET "public_prosecutor_is_registered_in_police_system" = true
        WHERE EXISTS (
          SELECT 1
          FROM "defendant_event_log" del
          WHERE del."case_id" = c."id"
            AND del."event_type" = 'PUBLIC_PROSECUTOR_REGISTERED_IN_POLICE_SYSTEM'
        )
        `,
        { transaction: t },
      )

      // Delete PUBLIC_PROSECUTOR_REGISTERED_IN_POLICE_SYSTEM from defendant_event_log
      await queryInterface.sequelize.query(
        `
        DELETE FROM "defendant_event_log"
        WHERE "event_type" = 'PUBLIC_PROSECUTOR_REGISTERED_IN_POLICE_SYSTEM'
        `,
        { transaction: t },
      )
    })
  },
}
