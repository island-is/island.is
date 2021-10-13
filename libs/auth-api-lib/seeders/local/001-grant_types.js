'use strict'

const authorization_code = {
  name: 'authorization_code',
  description: 'Authorization Code',
}

const client_credentials = {
  name: 'client_credentials',
  description: 'Client Credentials',
}

const token_exchange = {
  name: 'urn:ietf:params:oauth:grant-type:token-exchange',
  description: 'Token exchange',
}

const grant_types = [authorization_code, client_credentials, token_exchange]

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('grant_type', grant_types, {
        transaction,
      })
    } catch (err) {
      await transaction.rollback()
      throw err
    }

    transaction.commit()
  },

  down: async () => {
    // Do nothing
  },
}
