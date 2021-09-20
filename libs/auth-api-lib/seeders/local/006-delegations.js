/* eslint-disable local-rules/disallow-kennitalas */
'use strict'
const uuid = require('uuid/v4')

const delegation1 = {
  id: uuid(),
  from_national_id: '0101303019',
  from_display_name: 'Gervimaður Afríka',
  to_national_id: '0101307789',
  to_name: 'Gervimaður útlönd',
}

const delegations = [delegation1]

const delegation1_applications_read = {
  id: uuid(),
  delegation_id: delegation1.id,
  scope_name: '@island.is/applications:read',
  valid_from: new Date(),
}

const delegation1_profile = {
  id: uuid(),
  delegation_id: delegation1.id,
  identity_resource_name: 'profile',
  valid_from: new Date(),
}

const delegation_scopes = [delegation1_applications_read, delegation1_profile]

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('delegation', delegations, {
        transaction,
      })
      await queryInterface.bulkInsert('delegation_scope', delegation_scopes, {
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
