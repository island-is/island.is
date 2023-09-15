'use strict'

const client_id = '@island.is/web'

const client_redirect_uris = [
  {
    client_id: client_id,
    redirect_uri: 'https://beta.staging01.devland.is/umsoknir/signin-oidc',
  },
  {
    client_id: client_id,
    redirect_uri:
      'https://beta.staging01.devland.is/umsoknir/silent/signin-oidc',
  },
  {
    client_id: client_id,
    redirect_uri: 'https://island.is/umsoknir/signin-oidc',
  },
  {
    client_id: client_id,
    redirect_uri: 'https://island.is/umsoknir/silent/signin-oidc',
  },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert(
        'client_redirect_uri',
        client_redirect_uris,
        {
          transaction,
        },
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      if (
        err.parent.table == 'client_redirect_uri' &&
        err.name != 'SequelizeUniqueConstraintError'
      ) {
        throw err
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkDelete(
        'client_redirect_uri',
        client_redirect_uris,
        {},
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
