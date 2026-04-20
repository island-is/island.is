'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "verdict"
         SET "external_police_document_id" = 'eaebfb6a-f343-4bd4-8ff0-dc8bf88606c3',
              "service_status" = null,
              "service_date" = null,
              "served_by" = null,
              "comment" = null
         WHERE "id" = '17dd64b6-9803-4a3a-a129-ff23ecb8feb3'`,
        { transaction },
      ),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
