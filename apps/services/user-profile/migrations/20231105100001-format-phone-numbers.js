'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      UPDATE user_profile
      SET mobile_phone_number = CONCAT('+354-', mobile_phone_number)
      WHERE mobile_phone_number NOT LIKE '+354-%' AND mobile_phone_number IS NOT NULL;
    COMMIT;
  `)
  },

  down: () => {
    // We could create a new `mobile_phone_number_backup` to store the
    // old value and use this down migration to restore the value in
    // `mobile_phone_number_backup` and then delete it.
    return Promise.resolve()
  },
}
