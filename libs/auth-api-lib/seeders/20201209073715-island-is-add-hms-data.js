'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const secrets = [
      {
        client_id: 'apex-auth_client',
        value: '6THtRPZEkgZHoEc3YIqwDlo8y3AqBIgyeiq0D+Lj0t8=',
        description: 'secret for apex-auth_client',
        expiration: null,
        type: 'SharedSecret',
      },
    ]

    const redirectUri = [
      {
        client_id: 'apex-auth_client',
        redirect_uri:
          'https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/r/hms_app_app/test-island-is-authentication/signin-oidc',
      },
    ]

    return new Promise((resolve) => {
      Promise.all([
        queryInterface.sequelize.query(
          "UPDATE client SET require_pkce = false, require_client_secret = true WHERE client_id IN ('apex-auth_client')",
        ),
        queryInterface.bulkInsert('client_secret', secrets, {}),
        queryInterface.bulkInsert('client_redirect_uri', redirectUri, {}),
      ]).then(() => {
        resolve('done')
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.sequelize.query(
          "UPDATE client SET require_pkce = true, require_client_secret = false WHERE client_id IN ('apex-auth_client')",
        ),
        queryInterface.bulkDelete('client_secret', [
          {
            client_id: 'apex-auth_client',
            value: '6THtRPZEkgZHoEc3YIqwDlo8y3AqBIgyeiq0D+Lj0t8=',
            description: 'secret for apex-auth_client',
            type: 'SharedSecret',
          },
        ]),
        queryInterface.bulkDelete('client_redirect_uri', [
          {
            client_id: 'apex-auth_client',
            redirect_uri:
              'https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/r/hms_app_app/test-island-is-authentication/signin-oidc',
          },
        ]),
      ]).then(() => {
        resolve('done')
      })
    })
  },
}
