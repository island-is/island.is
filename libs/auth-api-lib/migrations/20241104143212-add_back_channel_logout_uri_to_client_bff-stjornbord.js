'use strict'

const BFF_ADMIN_PORTAL_CLIENT_ID = '@admin.island.is/bff-stjornbord'

module.exports = {
  async up(queryInterface) {
    /**
     * Add altering commands here.
     */
    return queryInterface.sequelize.query(`
      UPDATE "client"
      SET back_channel_logout_uri = 'https://island.is/stjornbord/bff/callbacks/logout'
      WHERE client_id = '${BFF_ADMIN_PORTAL_CLIENT_ID}';
    `)
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     */
    return queryInterface.sequelize.query(`
      UPDATE "client"
      SET back_channel_logout_uri = NULL
      WHERE client_id = '${BFF_ADMIN_PORTAL_CLIENT_ID}';
    `)
  },
}
