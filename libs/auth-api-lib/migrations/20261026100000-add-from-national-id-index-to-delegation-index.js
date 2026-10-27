'use strict'

// The primary key starts with to_national_id. Concurrently, so no transaction.
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('delegation_index', ['from_national_id'], {
      name: 'idx_delegation_index_from_national_id',
      concurrently: true,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'delegation_index',
      'idx_delegation_index_from_national_id',
      { concurrently: true },
    )
  },
}
