'use strict'

module.exports = {
  async down() {
    console.log('Irreversible migration')
  },

  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        DO $$
        DECLARE
            -- 🔖 Domain name to delete
            v_domain_name TEXT := '@rikiskaup.is';

            client_rec RECORD;
            api_scope_rec RECORD;
            delegation_id_to_check UUID;

        BEGIN
            -- 🔁 Loop through clients
            FOR client_rec IN
                SELECT client_id FROM client WHERE domain_name = v_domain_name
            LOOP
                -- 🚮 Delete all client related rows linked to this domain
                DELETE FROM client_delegation_types WHERE client_id = client_rec.client_id;
                DELETE FROM client_allowed_scope WHERE client_id = client_rec.client_id;
                DELETE FROM client_claim WHERE client_id = client_rec.client_id;
                DELETE FROM client_grant_type WHERE client_id = client_rec.client_id;
                DELETE FROM client_post_logout_redirect_uri WHERE client_id = client_rec.client_id;
                DELETE FROM client_secret WHERE client_id = client_rec.client_id;

                -- 🚮 Delete the client rows
                DELETE FROM client WHERE client_id = client_rec.client_id;
            END LOOP;

            -- 🔁 Loop through api scopes
            FOR api_scope_rec IN
                SELECT name FROM api_scope WHERE domain_name = v_domain_name
            LOOP
                -- 🔎 Find all delegation_scope rows linked to this scope
                FOR delegation_id_to_check IN
                    SELECT delegation_id FROM delegation_scope WHERE scope_name = api_scope_rec.name
                LOOP
                    -- 🚮 Delete the delegation_scope rows
                    DELETE FROM delegation_scope WHERE scope_name = api_scope_rec.name AND delegation_id = delegation_id_to_check;

                    -- 🧹 If it's the last scope using this delegation, delete the delegation 🧼
                    IF NOT EXISTS (
                        SELECT 1 FROM delegation_scope WHERE delegation_id = delegation_id_to_check
                    ) THEN
                        DELETE FROM delegation WHERE id = delegation_id_to_check;
                    END IF;
                END LOOP;

                -- 🚮 Delete all api_scope related rows linked to this domain
                DELETE FROM api_scope_user_access WHERE scope = api_scope_rec.name;
                DELETE FROM api_scope_user_claim WHERE api_scope_name = api_scope_rec.name;
                DELETE FROM api_scope_delegation_types WHERE api_scope_name = api_scope_rec.name;

                -- 🚮 Delete the api_scope rows
                DELETE FROM api_scope WHERE name = api_scope_rec.name;
            END LOOP;

            DELETE from domain where name = v_domain_name;
        END $$;`,
        { transaction },
      )
    })
  },
}
