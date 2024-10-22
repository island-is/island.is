module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        INSERT INTO delegation_provider
        (id, name, description)
        VALUES
        ('syslumenn', 'Sýslumenn', 'Provider for district commissioners registry');
        
        INSERT INTO delegation_type
        (id, provider, name, description)
        VALUES
        ('LegalRepresentative', 'syslumenn', 'Legal Representative', 'Legal Representative delegation type');

        INSERT INTO api_scope_delegation_types
        (api_scope_name, delegation_type)
        VALUES
        ('@island.is/documents', 'LegalRepresentative');

        INSERT INTO client_delegation_types
        (client_id, delegation_type)
        VALUES
        ('@island.is/web', 'LegalRepresentative');

      COMMIT;
    `)
  },

  down(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        DELETE FROM client_delegation_types
        WHERE client_id = '@island.is/web' AND delegation_type = 'LegalRepresentative';

        DELETE FROM api_scope_delegation_types
        WHERE api_scope_name = '@island.is/documents' AND delegation_type = 'LegalRepresentative';
        
        DELETE FROM delegation_type
        WHERE id = 'LegalRepresentative';

        DELETE FROM delegation_provider
        WHERE id = 'syslumenn';

      COMMIT;
    `)
  },
}
