'use strict'

const COMPLETED = 'COMPLETED'
const RULING = 'RULING'

module.exports = {
  async up(queryInterface) {
    console.log('VERDICT MIGRATION')
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(
          `SELECT d.id, d.case_id, c.ruling_date, d.service_requirement, d.information_for_defendant, d.verdict_view_date, d.verdict_appeal_date, d.verdict_appeal_decision  FROM "case" as c JOIN "defendant" as d ON d.case_id = c.id WHERE c.state = '${COMPLETED}' AND c.indictment_ruling_decision = '${RULING}'`,
          { transaction: t },
        )
        .then((res) => {
          console.log('RESULTS')
          console.log(res[0])
          return Promise.all(
            res[0].map((caseDefendant) => {
              console.log({ caseDefendant })
              // queryInterface.sequelize.query
              // `INSERT INTO "verdict" (id, defendant_id, case_id, service_requirement,service_status,service_date,appeal_decision, appeal_date, service_information_for_defendant) VALUES (md5(random()::text || clock_timestamp()::text)::uuid, '${
              //   defendant.id
              // }', '${o.offense}', '${JSON.stringify(o.substances)}');`,
              // {
              //   transaction: t,
              // },
            }),
          )
        }),
    )
  },

  // TODO: potentially add a migration flag to each row and revert only those
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
