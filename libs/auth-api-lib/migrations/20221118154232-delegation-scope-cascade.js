'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE delegation_scope
          DROP CONSTRAINT FK_delegation_scope_delegation;

        ALTER TABLE delegation_scope
          ADD CONSTRAINT FK_delegation_scope_delegation
            FOREIGN KEY (delegation_id) REFERENCES public.delegation (id)
              ON DELETE CASCADE;
      COMMIT;
    `)
  },

  down: () => {
    // Nothing to do here.
  },
}
