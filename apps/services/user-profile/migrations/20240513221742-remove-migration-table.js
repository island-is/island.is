'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.dropTable('user_profile_advania')
  },

  async down() {
    /**
     * This migration is cleaning up the migration table used when we migrated from the old user profile database.
     *
     * There is no down action as we cannot reinstate the data that was dropped along with the table.
     */
  },
}
