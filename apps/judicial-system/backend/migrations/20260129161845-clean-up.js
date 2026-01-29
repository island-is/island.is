'use strict'

const case_ids = [
  '7539d04d-c6a1-4a95-811f-fec2fc85c1e5', // Sannur Jóli R-373/2025
  '91dda2b7-0895-4541-befd-c9b9f27b4011', // Vera Varnardóttir R-377/2025
]

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.sequelize.query(
          `DELETE FROM "subpoena" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "verdict" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "victim" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "robot_log" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "notification" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "indictment_count" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "event_log" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "date_log" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "court_session_string" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "court_session" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "court_document" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "civil_claimant" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "case_string" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "case_file" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "case_archive" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "defendant" WHERE "case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        // Cannot handle cascading deletes with parent_case_id
        queryInterface.sequelize.query(
          `DELETE FROM "case" WHERE "parent_case_id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
        queryInterface.sequelize.query(
          `DELETE FROM "case" WHERE "id" IN (:vals);`,
          { replacements: { vals: case_ids }, transaction },
        ),
      ]),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
