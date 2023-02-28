'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
    BEGIN;
        CREATE INDEX case__parent_case_id__index
        ON "case" (parent_case_id uuid_ops);

        CREATE INDEX case_file__case_id_state__index
        ON "case_file" (case_id uuid_ops, state enum_ops);

        CREATE INDEX defendant__case_id_created__index
        ON "defendant" (case_id uuid_ops, created);

        CREATE INDEX notification__case_id_type__index
        ON "notification" (case_id uuid_ops, type enum_ops);
      COMMIT;
    `)
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        DROP INDEX case__parent_case_id__index;
        DROP INDEX case_file__case_id_state__index;
        DROP INDEX defendant__case_id_created__index;
        DROP INDEX notification__case_id_type__index;
      COMMIT;
    `)
  },
}
