const { stat, writeFile } = require('fs')
const { promisify } = require('util')
const { exec } = require('./utils')

/**
 * Because get-files-touched-by.sh cannot get files from nx cache
 * we skip the cache on PR and Push pipelines
 */
const skipCache = process.argv && process.argv[2] === '--skip-cache'

/**
 * We need to create this file manually with a dummy content because
 * the api needs it to build and generate the first schema file
 */
const SCHEMA_PATH = 'libs/api/schema/src/lib/schema.d.ts'

/**
 * See SCHEMAS.md to setup your project with auto-generated schemas files
 */
const TARGETS = [
  'schemas/external-openapi-generator', // If we depend on external services that comes with theirs own .yaml file (RC and not documented yet)
  'schemas/build-openapi', // Output openapi.yaml
  'schemas/openapi-generator', // Output gen/fetch/* based on openapi.yaml to run openapi-generator
  'schemas/build-graphql-schema', // Output api.graphql based on graphql app modules
  'schemas/codegen', // Output clients schemas (*.d.ts) based on codegen.yml
]

const fileExists = async (path) =>
  !!(await promisify(stat)(path).catch((_) => false))

const main = async () => {
  const schemaExists = await fileExists(SCHEMA_PATH)

  if (!schemaExists) {
    await promisify(writeFile)(SCHEMA_PATH, 'export default () => {}')
  }

  for (const target of TARGETS) {
    console.log(`--> Running command for ${target}\n`)

    try {
      await exec(
        `nx run-many --target=${target} --all --parallel --maxParallel=6 $NX_OPTIONS`,
        {
          env: skipCache
            ? { ...process.env, NX_OPTIONS: '--skip-nx-cache' }
            : process.env,
        },
      )
    } catch (err) {
      console.error(`Error running command: ${err.message}`)
      process.exit(err.code || 1)
    }
  }
}

main()
