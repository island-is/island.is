'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "verdict"
         SET "external_police_document_id" = 'ecf974e3-a29f-47dc-b836-a16d8b09b447',
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
