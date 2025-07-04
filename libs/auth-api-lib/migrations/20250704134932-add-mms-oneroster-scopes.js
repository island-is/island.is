'use strict'

module.exports = {
  async up(queryInterface) {
    /**
     * Adding scopes for MMS Oneroster as they don't conform to the naming convention we need to do it by migration script.
     * See specification here https://www.imsglobal.org/sites/default/files/spec/oneroster/v1p2/rostering-restbinding/OneRosterv1p2RosteringService_RESTBindv1p0.html#Main4p3
     */
    await queryInterface.sequelize.query(`
      INSERT INTO api_scope (name, display_name, description, domain_name, enabled, show_in_discovery_document, required, emphasize, allow_explicit_delegation_grant, automatic_delegation_grant, also_for_delegated_user, is_access_controlled, grant_to_legal_guardians, grant_to_procuring_holders, grant_to_personal_representatives)
      VALUES
        ('https://purl.imsglobal.org/spec/or/v1p2/scope/roster-core.readonly','Roster Core ReadOnly', 'The core set of read operations to enable information about collections or a single object to be obtained.', '@mms.is', true, false, false, false, false, false, false, false, false, false, false),
        ('https://purl.imsglobal.org/spec/or/v1p2/scope/roster-demographics.readonly', 'Roster Demographics ReadOnly', 'The read operations to provide all demographics or a single demographics object to be obtained.', '@mms.is', true, false, false, false, false, false, false, false, false, false, false),
        ('https://purl.imsglobal.org/spec/or/v1p2/scope/roster.readonly', 'Roster ReadOnly', 'Support for all of the read operations (excluding demographics) to enable information about collections or a single object to be obtained.', '@mms.is', true, false, false, false, false, false, false, false, false, false, false);
    `)
  },

  async down() {
    /**
     * As the db is not using ON Cascade it is unsafe to remove the scopes as they could have been granted to clients
     * or used by delegations.
     *
     * If we need to remove the scopes we need to do it manually.
     */
  },
}
