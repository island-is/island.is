const { stat, writeFile } = require('fs')
const { promisify } = require('util')
const { exec } = require('./utils')

/**
 * Because get-files-touched-by.sh cannot get files from nx cache
 * we skip the cache on PR and Push pipelines
 */
const skipCache =
  process.argv.includes('--skip-cache') ||
  process.argv.includes('--skip-nx-cache')
console.log('skipCache: ', skipCache)

/**
 * We need to create this file manually with a dummy content because
 * the api needs it to build and generate the first schema file
 */
const SCHEMA_PATH = 'libs/api/schema/src/lib/schema.ts'

/**
 * See https://docs.devland.is/repository/codegen about setting up your project with auto-generated API schema and client files
 */
const TARGETS = ['codegen/backend-schema', 'codegen/frontend-client']

/**
 * Promisified versions of fs methods.
 */
const statAsync = promisify(stat)
const writeFileAsync = promisify(writeFile)

const fileExists = async (path) => {
  try {
    await statAsync(path)
    return true
  } catch {
    return false
  }
}

const main = async () => {
  try {
    const schemaExists = await fileExists(SCHEMA_PATH)
    if (!schemaExists) {
      await writeFileAsync(SCHEMA_PATH, 'export default () => {};')
    }

    for (const target of TARGETS) {
      console.log(`--> Running command for ${target}`)
      await exec(
        `yarn nx run-many --target=${target} --parallel=6 --nx-bail=true $NX_OPTIONS ${
          skipCache ? '--skip-nx-cache' : ''
        }`,
        {
          env: process.env,
        },
      )
    }
  } catch (err) {
    console.error(`Error running command: ${err}`)
    process.exit(1)
  }
}

main()
