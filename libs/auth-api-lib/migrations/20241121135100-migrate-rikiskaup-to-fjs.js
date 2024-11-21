'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
        BEGIN;

        -- If delegator has granted a delegation to the delegatee for FJS AND Rikiskaup we change the delegetion_id reference for all 
        -- delegation_scopes in domain rikiskaup
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

        -- This leaves us with rows in delegation that have same to_national_id and from_national_id and domain=@rikiskaup.is as another row  
        -- with domain=@fjs.is. We need to delete those entries before the next step to avoid breaking uniqueness constraint
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
