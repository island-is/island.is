'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      DELETE FROM emails
      WHERE "primary" = true
        AND (email IS NULL OR email = '')
        AND email_status IN ('EMPTY', 'NOT_DEFINED');
    COMMIT;
  `)
  },

  down: () => {
    // Not reversible — placeholder rows carried no information to reconstruct
    return Promise.resolve()
  },
}
