'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Add new columns
      await queryInterface.addColumn('defendant_event_log', 'national_id', {
        type: queryInterface.sequelize.Sequelize.STRING,
        allowNull: true,
        transaction: t,
      })
      await queryInterface.addColumn('defendant_event_log', 'user_role', {
        type: queryInterface.sequelize.Sequelize.STRING,
        allowNull: true,
        transaction: t,
      })
      await queryInterface.addColumn('defendant_event_log', 'user_name', {
        type: queryInterface.sequelize.Sequelize.STRING,
        allowNull: true,
        transaction: t,
      })
      await queryInterface.addColumn('defendant_event_log', 'user_title', {
        type: queryInterface.sequelize.Sequelize.STRING,
        allowNull: true,
        transaction: t,
      })
      await queryInterface.addColumn(
        'defendant_event_log',
        'institution_name',
        {
          type: queryInterface.sequelize.Sequelize.STRING,
          allowNull: true,
          transaction: t,
        },
      )

      // Insert INDICTMENT_REVIEWED events as defendant events (one per defendant)
      await queryInterface.sequelize.query(
        `
        INSERT INTO "defendant_event_log" (
          "id",
          "created",
          "modified",
          "case_id",
          "defendant_id",
          "event_type",
          "national_id",
          "user_role",
          "user_name",
          "user_title",
          "institution_name"
        )
        SELECT
          gen_random_uuid(),
          date_trunc('milliseconds', el."created"),
          date_trunc('milliseconds', el."created"),
          el."case_id",
          d."id",
          'INDICTMENT_REVIEWED',
          el."national_id",
          el."user_role",
          el."user_name",
          el."user_title",
          el."institution_name"
        FROM "event_log" el
        INNER JOIN "defendant" d ON d."case_id" = el."case_id"
        WHERE el."event_type" = 'INDICTMENT_REVIEWED'
        `,
        { transaction: t },
      )

      // Delete INDICTMENT_REVIEWED events from event_log
      await queryInterface.sequelize.query(
        `
        DELETE FROM "event_log"
        WHERE "event_type" = 'INDICTMENT_REVIEWED'
        `,
        { transaction: t },
      )
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Move INDICTMENT_REVIEWED events back to event_log
      await queryInterface.sequelize.query(
        `
        INSERT INTO "event_log" (
          "id",
          "created",
          "event_type",
          "case_id",
          "national_id",
          "user_role",
          "user_name",
          "user_title",
          "institution_name"
        )
        SELECT DISTINCT ON (del."case_id")
          gen_random_uuid(),
          date_trunc('milliseconds', del."created"),
          'INDICTMENT_REVIEWED',
          del."case_id",
          del."national_id",
          del."user_role",
          del."user_name",
          del."user_title",
          del."institution_name"
        FROM "defendant_event_log" del
        WHERE del."event_type" = 'INDICTMENT_REVIEWED'
        ORDER BY del."case_id", del."created" DESC
        `,
        { transaction: t },
      )

      // Delete INDICTMENT_REVIEWED from defendant_event_log
      await queryInterface.sequelize.query(
        `
        DELETE FROM "defendant_event_log"
        WHERE "event_type" = 'INDICTMENT_REVIEWED'
        `,
        { transaction: t },
      )

      // Drop the new columns
      await queryInterface.removeColumn(
        'defendant_event_log',
        'institution_name',
        { transaction: t },
      )
      await queryInterface.removeColumn('defendant_event_log', 'user_title', {
        transaction: t,
      })
      await queryInterface.removeColumn('defendant_event_log', 'user_name', {
        transaction: t,
      })
      await queryInterface.removeColumn('defendant_event_log', 'user_role', {
        transaction: t,
      })
      await queryInterface.removeColumn('defendant_event_log', 'national_id', {
        transaction: t,
      })
    })
  },
}
