'use strict'

const openid = {
  name: 'openid',
  display_name: 'OpenId',
  description: '',
  enabled: true,
  show_in_discovery_document: true,
  required: true,
  emphasize: true,
  grant_to_legal_guardians: false,
  grant_to_procuring_holders: false,
  allow_explicit_delegation_grant: false,
  also_for_delegated_user: false,
  automatic_delegation_grant: true,
}

const profile = {
  name: 'profile',
  display_name: 'Profile',
  description: '',
  enabled: true,
  show_in_discovery_document: true,
  required: false,
  emphasize: true,
  grant_to_legal_guardians: true,
  grant_to_procuring_holders: true,
  allow_explicit_delegation_grant: true,
  also_for_delegated_user: false,
  automatic_delegation_grant: false,
}

const identity_resources = [openid, profile]

const openid_user_claims = [
  {
    identity_resource_name: openid.name,
    claim_name: 'sub',
  },
  {
    identity_resource_name: openid.name,
    claim_name: 'nationalId',
  },
  {
    identity_resource_name: openid.name,
    claim_name: 'nat',
  },
]

const profile_user_claims = [
  {
    identity_resource_name: profile.name,
    claim_name: 'birthdate',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'middle_name',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'updated_at',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'name',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'zoneinfo',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'locale',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'family_name',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'gender',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'nickname',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'picture',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'website',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'preferred_username',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'givename',
  },
  {
    identity_resource_name: profile.name,
    claim_name: 'profile',
  },
]

const identity_resource_user_claims = [
  ...openid_user_claims,
  ...profile_user_claims,
]

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('identity_resource', identity_resources, {
        transaction,
      })
      await queryInterface.bulkInsert(
        'identity_resource_user_claim',
        identity_resource_user_claims,
        {
          transaction,
        },
      )
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
