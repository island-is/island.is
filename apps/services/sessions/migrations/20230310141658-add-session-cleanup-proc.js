'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE OR REPLACE PROCEDURE delete_older_sessions()
          LANGUAGE plpgsql
      AS
      $$
      BEGIN
          DELETE
          FROM session
          WHERE created < now() - interval '1 year';
      END;
      $$;
    `)
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      DROP PROCEDURE delete_older_sessions;
    `)
  },
}
