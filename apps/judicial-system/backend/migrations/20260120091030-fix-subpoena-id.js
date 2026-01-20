'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "subpoena"
         SET "police_subpoena_id" = '87cea909-690a-4057-9696-ba1cdf4e71f8',
             "service_status" = null,
              "service_date" = null,
              "served_by" = null,
              "comment" = null
         WHERE "id" = 'aaa7144d-afe7-4303-b0f6-c9debedc7777'`,
        { transaction },
      ),
    )
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "subpoena"
         SET "police_subpoena_id" = '7891c4c4-3ce1-4cfe-b0a0-8769fda725b5',
             "service_status" = 'IN_PERSON',
              "service_date" = '2026-01-15T13:19:06.013Z',
              "served_by" = 'Gísli Kristinn Skúlason',
              "comment" = 'Um er að ræða villu en viðkomandi koma margfallt fyrir. Afreitt af lögreglumanni sem birt.'
         WHERE "id" = 'aaa7144d-afe7-4303-b0f6-c9debedc7777'`,
        { transaction },
      ),
    )
  },
}
