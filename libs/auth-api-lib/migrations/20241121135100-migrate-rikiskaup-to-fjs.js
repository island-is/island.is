'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
        BEGIN;

        -- There's 2 cases we need to handle
        -- A) Party A has granted a delegation to party B for both FJS and Rikiskaup domains. 
        --      In this case we want to change the delegation_id reference in delegation_scope from the Rikiskaup entry to the FJS entry.
        --      This avoids having duplicate (domain_name, to_national_id, from_national_id) trios
        -- B) Party A has granted a delegation to party B for Rikiskaup but not for FJS domain.
        --      In this case we can simply change the domain name for the delegation entry

        -- Find all entries in case A and change the delegation_id reference to the FJS entry. 
        UPDATE delegation_scope
        SET delegation_id = fjs_entry.id
        FROM delegation rikiskaup_entry
        JOIN delegation fjs_entry
            ON rikiskaup_entry.to_national_id = fjs_entry.to_national_id
            AND rikiskaup_entry.from_national_id = fjs_entry.from_national_id
            AND fjs_entry.domain_name = '@fjs.is'
        WHERE delegation_scope.delegation_id = rikiskaup_entry.id
            AND rikiskaup_entry.domain_name = '@rikiskaup.is'
            AND EXISTS (
            SELECT 1
            FROM delegation d
            WHERE d.domain_name = '@fjs.is'
                AND d.to_national_id = rikiskaup_entry.to_national_id
                AND d.from_national_id = rikiskaup_entry.from_national_id
        );

        -- Delete all rows in delegation which would break uniqueness contraint. 
        -- All foreign key references to these rows should have been changed in the previous step
        DELETE FROM delegation
        WHERE domain_name = '@rikiskaup.is'
            AND EXISTS (
            SELECT 1
            FROM delegation d
            WHERE d.domain_name = '@fjs.is'
                AND d.to_national_id = delegation.to_national_id
                AND d.from_national_id = delegation.from_national_id
            );

        -- Move remaining delegations from domain Rikiskaup to FJS
        -- TODO: change this to only change rows with foreign key references from delegation_scope
            UPDATE delegation
            SET domain_name='@fjs.is'
            WHERE domain_name='@rikiskaup.is'
            
        -- Optional 
        -- Delete all delegations with no scope grant in domain Rikiskaup
            DELETE FROM delegation
            WHERE id IN (
                SELECT d.id
                FROM delegation d
                LEFT JOIN scope s ON d.id = s.delegation_id
                WHERE s.delegation_id IS NULL
                AND d.domain_name = '@rikiskaup.is'
            );

        -- Next we update scope ID for all delegation scopes
            UPDATE delegation_scope t
            SET scope_name='TODO'
            WHERE t.scope_name='@rikiskaup.is/gagnaskilagatt';
    
        -- Optional 
        -- Remove Rikiskaup from the IDS
            -- disable Rikiskaup clients
            -- disable Rikiskaup scopes
            -- delete? Rikiskaup domain
            -- deactivate Rikiskaup api scope user
            -- delete Rikiskaup api scope user delegation grants

        COMMIT;
    `)
  },

  down: () => {
    // it's impossible to know which delegations were granted by users before or after the migration
    // thus it's impossible to revert the migration
  },
}
