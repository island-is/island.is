'use strict'

const redirect_uri = [
  {
    client_id: 'apex-auth_client',
    redirect_uri:
      'https://tcqqxwk4o7udq5x-hgrprod.adb.eu-frankfurt-1.oraclecloudapps.com/ords/apex_authentication.callback',
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('client_redirect_uri', redirect_uri)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('client_redirect_uri', redirect_uri)
  },
}
