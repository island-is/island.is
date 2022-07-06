'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
          CREATE TABLE personal_representative_scope_permission (
            id UUID NOT NULL,
            right_type_code VARCHAR NOT NULL,
            api_scope_name VARCHAR NOT NULL,
            created TIMESTAMP WITH TIME ZONE DEFAULT now(),
            modified TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY (id),
            UNIQUE (right_type_code, api_scope_name)
          );
          ALTER TABLE personal_representative_scope_permission 
          ADD CONSTRAINT FK_personal_representative_scope_permission_right_type FOREIGN KEY (right_type_code)
          REFERENCES personal_representative_right_type (code);
  
          ALTER TABLE personal_representative_scope_permission 
          ADD CONSTRAINT FK_personal_representative_scope_permission_api_scope FOREIGN KEY (api_scope_name)
          REFERENCES api_scope (name);
  
          COMMIT;
      `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        DROP TABLE personal_representative_scope_permission;
      COMMIT;
    `)
  },
}
