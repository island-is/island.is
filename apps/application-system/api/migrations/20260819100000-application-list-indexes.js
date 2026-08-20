'use strict'

// Indexes to support the admin overview list queries in application.service.ts
// (findAllByAdminFilters). The list always sorts by `modified DESC` and most
// filters land on `is_listed`, `applicant`, or `type_id`. Without these
// indexes Postgres has to sort the whole table for every high-offset page.
//
// CONCURRENTLY is used so the migration does not take a write lock on the
// `application` table while the indexes are built. This requires each
// statement to run outside a transaction — sequelize-cli does not wrap
// migrations in a transaction by default, so we intentionally do not open
// one here.

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS application_islisted_modified_idx ' +
        'ON application (is_listed, modified DESC);',
    )
    await queryInterface.sequelize.query(
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS application_applicant_modified_idx ' +
        'ON application (applicant, modified DESC);',
    )
    await queryInterface.sequelize.query(
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS application_type_id_modified_idx ' +
        'ON application (type_id, modified DESC);',
    )
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'DROP INDEX CONCURRENTLY IF EXISTS application_islisted_modified_idx;',
    )
    await queryInterface.sequelize.query(
      'DROP INDEX CONCURRENTLY IF EXISTS application_applicant_modified_idx;',
    )
    await queryInterface.sequelize.query(
      'DROP INDEX CONCURRENTLY IF EXISTS application_type_id_modified_idx;',
    )
  },
}
