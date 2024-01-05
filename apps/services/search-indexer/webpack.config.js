const path = require('path')

const createEntry = (pathSuffix) =>
  path.resolve(__dirname, `src/migrate/${pathSuffix}`)

module.exports = (config) => {
  config.entry = {
    ...config.entry,
    migrateAws: createEntry('migrateAws.ts'),
    migrateElastic: createEntry('migrateElastic.ts'),
    migrateKibana: createEntry('migrateKibana.ts'),
  }
  config.output.filename = '[name].js'

  return {
    ...config,
  }
}
