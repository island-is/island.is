'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE OR REPLACE PROCEDURE delete_expired_grants()
          LANGUAGE plpgsql
      AS
      $$
      BEGIN
          DELETE
          FROM grants
          WHERE expiration < now();
      END;
      $$;
    `)
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      DROP PROCEDURE delete_expired_grants;
    `)
  },
}
