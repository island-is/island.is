'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `CREATE EXTENSION IF NOT EXISTS pg_cron;`,
    )
    await queryInterface.sequelize.query(`
      SELECT cron.schedule('daily-at-3-am', '0 3 * * *', 'CALL delete_older_sessions()');
    `)
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
    SELECT cron.unschedule('daily-at-3-am');
  `)
    await queryInterface.sequelize.query(`DROP EXTENSION IF EXISTS pg_cron;`)
  },
}
