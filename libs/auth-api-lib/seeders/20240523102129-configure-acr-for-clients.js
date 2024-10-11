'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        update client
        set allowed_acr = '{eidas-loa-high, islandis-passkey}'
        where client_id = '@island.is/web';
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        update client
        set allowed_acr = '{eidas-loa-high}'
        where client_id = '@island.is/web';
      COMMIT;
    `)
  },
}
