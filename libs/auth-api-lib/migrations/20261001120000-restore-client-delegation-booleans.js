'use strict'

/*
 * Repairs clients where the legacy supports_* booleans on the client table
 * disagree with client_delegation_types.
 *
 * Until #16016 (2024-09-16) addClientDelegationTypes wrote all four booleans
 * unconditionally, so adding one delegation type reset the booleans of the
 * others to false while leaving their client_delegation_types rows in place.
 * client_delegation_types is the source of truth, so the booleans are restored
 * from it. Clients that already agree are left untouched, as is `modified`.
 */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      BEGIN;

        UPDATE client c
        SET supports_procuring_holders = true
        WHERE NOT c.supports_procuring_holders
          AND EXISTS (
            SELECT 1 FROM client_delegation_types d
            WHERE d.client_id = c.client_id
              AND d.delegation_type = 'ProcurationHolder'
          );

        UPDATE client c
        SET supports_custom_delegation = true
        WHERE NOT c.supports_custom_delegation
          AND EXISTS (
            SELECT 1 FROM client_delegation_types d
            WHERE d.client_id = c.client_id
              AND d.delegation_type = 'Custom'
          );

        UPDATE client c
        SET supports_legal_guardians = true
        WHERE NOT c.supports_legal_guardians
          AND EXISTS (
            SELECT 1 FROM client_delegation_types d
            WHERE d.client_id = c.client_id
              AND d.delegation_type = 'LegalGuardian'
          );

        UPDATE client c
        SET supports_personal_representatives = true
        WHERE NOT c.supports_personal_representatives
          AND EXISTS (
            SELECT 1 FROM client_delegation_types d
            WHERE d.client_id = c.client_id
              AND d.delegation_type LIKE 'PersonalRepresentative%'
          );

      COMMIT;
    `)
  },

  async down() {
    // No-op. The pre-migration booleans were the result of a bug and are not
    // recoverable, and reverting would take delegation support away from clients
    // whose client_delegation_types say they have it.
  },
}
