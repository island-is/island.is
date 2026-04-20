'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "subpoena"
         SET "police_subpoena_id" = '7891c4c4-3ce1-4cfe-b0a0-8769fda725b5',
             "service_status" = null,
              "service_date" = null,
              "served_by" = null,
              "comment" = null
         WHERE "id" = 'aaa7144d-afe7-4303-b0f6-c9debedc7777'`,
        { transaction },
      ),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
