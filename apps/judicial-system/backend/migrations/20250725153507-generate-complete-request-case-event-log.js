'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        INSERT INTO event_log (id, event_type, case_id, created)
        SELECT md5(random()::text || clock_timestamp()::text)::uuid, 'REQUEST_COMPLETED', n.case_id, n.created
        FROM (
          SELECT DISTINCT ON (case_id) *
          FROM notification
          WHERE type = 'RULING'
          ORDER BY case_id, created ASC
        ) AS n
        INNER JOIN "case" c ON c.id = n.case_id
        WHERE c.type != 'INDICTMENT'
        `,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        DELETE FROM event_log
        WHERE event_type = 'REQUEST_COMPLETED'
        `,
        { transaction },
      )
    })
  },
}
