'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('api_scope', [
      {
        enabled: true,
        name: '@64artic.is/delegations',
        display_name: 'Delegations',
        description: null,
        show_in_discovery_document: false,
        required: false,
        emphasize: false,
        grant_to_legal_guardians: false,
        grant_to_procuring_holders: true,
        allow_explicit_delegation_grant: true,
        custom_delegation_only_for: queryInterface.sequelize.literal(
          `ARRAY['ProcurationHolder'::enum_api_scope_custom_delegation_only_for]`,
        ),
        also_for_delegated_user: false,
        automatic_delegation_grant: false,
        is_access_controlled: false,
        domain_name: '@64artic.is',
      },
    ])
  },

  down: async () => {
    // Do nothing
  },
}
