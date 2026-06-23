'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "subpoena"
         SET "service_date" = '2026-06-19 19:52:00.000000+00'
         WHERE "id" = '4efb1a54-1eaf-489e-b90e-39de4bacff61'`,
        { transaction },
      ),
    )
  },

  async down() {
    return Promise.resolve()
  },
}
