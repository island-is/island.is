const { composePlugins, withNx } = require('@nx/webpack')
const path = require('path')

const createEntry = (pathSuffix) =>
  path.resolve(__dirname, `src/migrate/${pathSuffix}`)

module.exports = composePlugins(withNx(), (config) => {
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
})
