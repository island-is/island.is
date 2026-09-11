'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'application',
        'actor_national_id',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        { transaction },
      )

      await queryInterface.sequelize.query(
        `UPDATE "application"
         SET "actor_national_id" = "national_id"`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `WITH applications_with_two_applicants AS (
          SELECT "application_id"
          FROM "value"
          WHERE "field_type" = 'APPLICANT'
          GROUP BY "application_id"
          HAVING COUNT(*) = 2
            AND COUNT(*) FILTER (WHERE "json"->>'isLoggedInUser' = 'true') = 1
            AND COUNT(*) FILTER (WHERE "json"->>'isLoggedInUser' IS DISTINCT FROM 'true') = 1
        )
        UPDATE "application" AS application
        SET "national_id" = value."json"->>'nationalId'
        FROM "value" AS value
        INNER JOIN applications_with_two_applicants
          ON applications_with_two_applicants."application_id" = value."application_id"
        WHERE application."id" = value."application_id"
          AND value."field_type" = 'APPLICANT'
          AND value."json"->>'isLoggedInUser' IS DISTINCT FROM 'true'
          AND value."json"->>'nationalId' IS NOT NULL`,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('application', 'actor_national_id')
  },
}
