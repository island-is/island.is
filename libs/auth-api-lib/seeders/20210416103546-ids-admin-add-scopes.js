'use strict'

const api_resource = {
  national_id: '5501692829',
  contact_email: 'valure@fuglar.com',
  enabled: true,
  name: '@island.is/auth/admin',
  display_name: 'Auth admin backend',
  description: null,
  show_in_discovery_document: true,
}

const api_resources = [api_resource]

const api_resource_user_claims = [
  {
    api_resource_name: api_resource.name,
    claim_name: 'nationalId',
  },
]

const root = {
  enabled: true,
  name: '@island.is/auth/admin:root',
  display_name: 'Admin root access',
  description: null,
  show_in_discovery_document: false,
  required: false,
  emphasize: false,
  grant_to_legal_guardians: false,
  grant_to_procuring_holders: false,
  allow_explicit_delegation_grant: false,
  automatic_delegation_grant: false,
  also_for_delegated_user: false,
}

const full = {
  enabled: true,
  name: '@island.is/auth/admin:full',
  display_name: 'Full access',
  description: null,
  show_in_discovery_document: true,
  required: false,
  emphasize: false,
  grant_to_legal_guardians: false,
  grant_to_procuring_holders: false,
  allow_explicit_delegation_grant: false,
  automatic_delegation_grant: false,
  also_for_delegated_user: false,
}

const api_scopes = [root, full]

const api_resource_scopes = [
  {
    api_resource_name: api_resource.name,
    scope_name: root.name,
  },
  {
    api_resource_name: api_resource.name,
    scope_name: full.name,
  },
]

const client_id = '@island.is/auth-admin-web'

const client_allowed_scopes = [
  {
    client_id: client_id,
    scope_name: root.name,
  },
  {
    client_id: client_id,
    scope_name: full.name,
  },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('api_resource', api_resources, {
        transaction,
      })
      await queryInterface.bulkInsert(
        'api_resource_user_claim',
        api_resource_user_claims,
        { transaction },
      )
      await queryInterface.bulkInsert('api_scope', api_scopes, { transaction })
      await queryInterface.bulkInsert(
        'api_resource_scope',
        api_resource_scopes,
        { transaction },
      )

      await queryInterface.bulkInsert(
        'client_allowed_scope',
        client_allowed_scopes,
        { transaction },
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      if (
        !(
          err.parent.table == 'api_resource' &&
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
        'client_allowed_scope',
        client_allowed_scopes,
        {},
      )

      await queryInterface.bulkDelete(
        'api_resource_scope',
        api_resource_scopes,
        {
          transaction,
        },
      )
      await queryInterface.bulkDelete('api_scope', api_scopes, { transaction })
      await queryInterface.bulkDelete(
        'api_resource_user_claim',
        api_resource_user_claims,
        { transaction },
      )
      await queryInterface.bulkDelete('api_resource', api_resources, {
        transaction,
      })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
