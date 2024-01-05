'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE INDEX indictment_count__case_id_created__index
        ON "indictment_count" (case_id uuid_ops, created);

        DROP INDEX indictment_count__case_id__index;

        CREATE INDEX case_file__case_id_state_category__index
        ON "case_file" (case_id uuid_ops, state enum_ops, category enum_ops);
        
        DROP INDEX case_file__case_id_state__index;
      COMMIT;
    `)
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE INDEX indictment_count__case_id__index
        ON "indictment_count" (case_id uuid_ops);

        DROP INDEX indictment_count__case_id_created__index;

        CREATE INDEX case_file__case_id_state__index
        ON "case_file" (case_id uuid_ops, state enum_ops);

        DROP INDEX case_file__case_id_state_category__index;
      COMMIT;
    `)
  },
}
