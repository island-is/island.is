'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    // We prefer doing delegation duplication to the new FJS scope to avoid
    // any downtime for users while FJS updates the clientId.
    return queryInterface.sequelize.query(`
        BEGIN;

        -- Duplicating all delegations granted in the @rikisskaup.is domain to the @fjs.is domain
        -- for delegations granted to the Ríkiskaup gagnaskilagátt
        INSERT INTO delegation("id","from_national_id","from_display_name","to_national_id","created","modified","to_name","domain_name","created_by_national_id")
        SELECT d."id",d."from_national_id",d."from_display_name",d."to_national_id",d."created",d."modified",d."to_name",d."domain_name",d."created_by_national_id"
        FROM delegation d
        JOIN delegation_scope ds ON d.id = ds.delegation_id
        WHERE d.domain_name = '@rikiskaup.is'
          AND ds.scope_name = '@rikiskaup.is/gagnaskilagatt'
        ;

        -- Duplicating all delegation scopes granted in the @rikisskaup.is domain to the @fjs.is domain
        -- related to the delegations above.
        INSERT INTO delegation_scope("delegation_id","scope_name","created","modified","valid_from","valid_to")
        SELECT ds."delegation_id",ds."scope_name",ds."created",ds."modified",ds."valid_from",ds."valid_to"
        FROM delegation d
        JOIN delegation_scope ds ON d.id = ds.delegation_id
        WHERE d.domain_name = '@rikiskaup.is'
          AND ds.scope_name = '@rikiskaup.is/gagnaskilagatt'

        COMMIT;
    `)
  },

  down: () => {
    // it's impossible to know which delegations were granted by users before or after the migration
    // thus it's impossible to revert the migration
  },
}
