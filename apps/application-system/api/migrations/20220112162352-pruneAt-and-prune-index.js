'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE INDEX pruned_and_pruneAt_idx ON application (prune_at, pruned) WHERE (pruned = FALSE AND prune_at IS NOT NULL);

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP INDEX pruned_and_pruneAt_idx;
    `)
  },
}
