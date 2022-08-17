'use strict'

const client_id = '@island.is/auth-admin-web'

const client_redirect_uris = [
  {
    client_id: client_id,
    redirect_uri:
      'https://identity-server.staging01.devland.is/admin/api/auth/callback/identity-server',
  },
  {
    client_id: client_id,
    redirect_uri:
      'https://innskra.island.is/admin/api/auth/callback/identity-server',
  },
]

const client_post_logout_redirect_uris = [
  {
    client_id: client_id,
    redirect_uri: 'https://identity-server.staging01.devland.is/admin',
  },
  {
    client_id: client_id,
    redirect_uri: 'https://innskra.island.is/admin',
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
      await queryInterface.bulkInsert(
        'client_post_logout_redirect_uri',
        client_post_logout_redirect_uris,
        {
          transaction,
        },
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      if (
        !(
          err.parent.table == 'client_redirect_uri' &&
          err.name == 'SequelizeUniqueConstraintError'
        )
      ) {
        throw err
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkDelete(
        'client_post_logout_redirect_uri',
        client_post_logout_redirect_uris,
        {},
      )
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
