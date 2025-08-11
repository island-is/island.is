'use strict'

const COMPLETED = 'COMPLETED'
const RULING = 'RULING'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query(
        `INSERT INTO "verdict" (id, defendant_id, case_id, service_requirement, service_status, service_date, appeal_decision, appeal_date, service_information_for_defendant)
                    SELECT md5(random()::text || clock_timestamp()::text)::uuid, d.id, d.case_id, d.service_requirement, 'NOT_APPLICABLE', d.verdict_view_date, d.verdict_appeal_decision, d.verdict_appeal_date, d.information_for_defendant
                    FROM "case" as c JOIN "defendant" as d ON d.case_id = c.id 
                    WHERE c.state = '${COMPLETED}'
                      AND c.indictment_ruling_decision = '${RULING}'
                      AND NOT EXISTS (SELECT 1 FROM "verdict" v WHERE v.defendant_id = d.id)`,
        {
          transaction: t,
        },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query(
        `DELETE FROM "verdict" WHERE service_status = 'NOT_APPLICABLE'`,
        { transaction: t },
      ),
    )
  },
}
