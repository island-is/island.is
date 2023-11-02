'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "user" set role='ASSISTANT' where role='REGISTRAR' and institution_id='4676f08b-aab4-4b4f-a366-697540788088'`,
        { transaction },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "user" set role='REGISTRAR' where role='ASSISTANT' and institution_id='4676f08b-aab4-4b4f-a366-697540788088'`,
        { transaction },
      ),
    )
  },
}
