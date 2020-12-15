'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "UPDATE client_redirect_uri SET redirect_uri = 'https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/apex_authentication.callback' WHERE client_id IN ('apex-auth_client') and redirect_uri IN ('https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/apex_authentication_callback')",
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "UPDATE client_redirect_uri SET redirect_uri = 'https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/apex_authentication_callback' WHERE client_id IN ('apex-auth_client') and redirect_uri IN ('https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/apex_authentication.callback')",
    )
  },
}
