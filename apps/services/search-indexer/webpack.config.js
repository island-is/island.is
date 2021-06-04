const path = require('path')
module.exports = (config) => {
  const basePath = 'apps/services/search-indexer/src'
  config.entry = {
    ...config.entry,
    migrateAws: './' + path.join(basePath, './migrate/migrateAws.ts'),
    migrateElastic: './' + path.join(basePath, './migrate/migrateElastic.ts'),
    migrateKibana: './' + path.join(basePath, './migrate/migrateKibana.ts'),
  }
  config.output.filename = '[name].js'
  return {
    ...config,
  }
}
