'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE INDEX indictment_count__case_id__index
        ON "indictment_count" (case_id uuid_ops);
        CREATE INDEX event_log__case_id_event_type__index
        ON "event_log" (case_id uuid_ops, event_type);
      COMMIT;
    `)
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        DROP INDEX indictment_count__case_id__index;
        DROP INDEX event_log__case_id_event_type__index;
      COMMIT;
    `)
  },
}
