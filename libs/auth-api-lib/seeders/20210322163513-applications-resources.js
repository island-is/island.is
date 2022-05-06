'use strict'

const api_resource = {
  national_id: '5501692829',
  contact_email: 'eirikur@aranja.com',
  enabled: true,
  name: '@island.is',
  display_name: 'Island.is APIs',
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

const applications_read = {
  enabled: true,
  name: '@island.is/applications:read',
  display_name: 'Lesaðgangur að umsóknum',
  description: null,
  show_in_discovery_document: true,
  required: false,
  emphasize: false,
}

const applications_write = {
  enabled: true,
  name: '@island.is/applications:write',
  display_name: 'Búa til umsóknir',
  description: null,
  show_in_discovery_document: true,
  required: false,
  emphasize: false,
}

const api_scopes = [applications_read, applications_write]

const api_resource_scopes = [
  {
    api_resource_name: api_resource.name,
    scope_name: applications_read.name,
  },
  {
    api_resource_name: api_resource.name,
    scope_name: applications_write.name,
  },
]

const api_scope_user_claims = [
  {
    api_scope_name: applications_read.name,
    claim_name: 'nationalId',
  },
  {
    api_scope_name: applications_write.name,
    claim_name: 'nationalId',
  },
]

const client_id = '@island.is/web'

const client_allowed_scopes = [
  {
    client_id: client_id,
    scope_name: applications_read.name,
  },
  {
    client_id: client_id,
    scope_name: applications_write.name,
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
        'api_scope_user_claim',
        api_scope_user_claims,
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
        err.parent.table == 'api_resource' &&
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
        'client_allowed_scope',
        client_allowed_scopes,
        {},
      )

      await queryInterface.bulkDelete(
        'api_scope_user_claim',
        api_scope_user_claims,
        { transaction },
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
