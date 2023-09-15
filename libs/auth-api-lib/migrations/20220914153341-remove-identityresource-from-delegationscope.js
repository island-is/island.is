'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn(
      'delegation_scope',
      'identity_resource_name',
    )
  },

  async down() {
    /**
     * There is no turning back
     */
  },
}
