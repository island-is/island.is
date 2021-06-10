'use strict'
/* eslint-env node */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        ALTER TABLE delegation_scope
        ADD COLUMN id VARCHAR NULL; -- TMP, change to uuid later
    
        UPDATE delegation_scope
          SET id = concat(delegation_id, '+', scope_name); -- TMP, fix later
    
        ALTER TABLE delegation_scope
        ALTER COLUMN id SET NOT NULL;
    
        ALTER TABLE delegation_scope
        DROP CONSTRAINT delegation_scope_pkey;
    
        ALTER TABLE delegation_scope
        ADD PRIMARY KEY (id);
    
        ALTER TABLE delegation_scope
        ADD COLUMN identity_resource_name VARCHAR NULL;
    
        ALTER TABLE delegation_scope
        ALTER COLUMN scope_name DROP NOT NULL;
    
        DELETE FROM delegation_scope
        WHERE NOT (EXISTS (select 0 from api_scope where name = delegation_scope.scope_name)
            OR EXISTS (select 0 from identity_resource where name = delegation_scope.scope_name));

        UPDATE delegation_scope
            SET identity_resource_name = scope_name
            WHERE EXISTS (select 0 from identity_resource where name = delegation_scope.scope_name);

        UPDATE delegation_scope
            SET scope_name = null
            WHERE scope_name = identity_resource_name;
            
        ALTER TABLE delegation_scope
        ADD CONSTRAINT FK_delegation_scope_api_scope FOREIGN KEY (scope_name)
        REFERENCES api_scope (name);
    
        ALTER TABLE delegation_scope
        ADD CONSTRAINT FK_delegation_scope_identity_resource FOREIGN KEY (identity_resource_name)
        REFERENCES identity_resource (name);
    
        ALTER TABLE delegation_scope
        ADD CONSTRAINT CHK_scope_name_or_identity_resource_name CHECK (
            CASE WHEN scope_name IS NULL THEN 0 ELSE 1 END
            + CASE WHEN identity_resource_name IS NULL THEN 0 ELSE 1 END
            = 1
            );

        ALTER TABLE delegation
        ADD COLUMN to_name VARCHAR NULL;
    
        UPDATE delegation
            SET to_name = '' WHERE to_name IS NULL;
    
        ALTER TABLE delegation
        ALTER COLUMN to_name SET NOT NULL;
        
      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        
        ALTER TABLE delegation_scope
        DROP CONSTRAINT CHK_scope_name_or_identity_resource_name;

        ALTER TABLE delegation_scope
        DROP CONSTRAINT FK_delegation_scope_identity_resource;

        ALTER TABLE delegation_scope
        DROP CONSTRAINT FK_delegation_scope_api_scope;

        ALTER TABLE delegation_scope
        DROP COLUMN identity_resource_name;

      COMMIT;
    `)
  },
}
