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
const SCHEMA_PATH = 'libs/api/schema/src/lib/schema.ts'

/**
 * See https://docs.devland.is/repository/codegen about setting up your project with auto-generated API schema and client files
 */
const TARGETS = [
  'codegen/backend-client',
  'codegen/backend-schema',
  'codegen/frontend-client',
]

const fileExists = async (path) =>
  !!(await promisify(stat)(path).catch((_) => false))

const main = async () => {
  let exitCode = 0
  const schemaExists = await fileExists(SCHEMA_PATH)
  const nxParallel = parseInt(process.env.NX_PARALLEL ?? '6', 10)
  // NX_MAX_PARALLEL sets the parallelism for file system operations in Nx.
  // Setting lower than the CPU parallelism to decrease probability of race conditions and disk I/O saturation
  const nxMaxParallel = Math.round(
    parseInt(process.env.NX_MAX_PARALLEL ?? nxParallel, 10) / 2,
  )

  if (!schemaExists) {
    await promisify(writeFile)(SCHEMA_PATH, 'export default () => {}')
  }

  for (const target of TARGETS) {
    console.log(`--> Running command for ${target}\n`)

    try {
      await exec(
        `nx run-many --target=${target} --all --parallel=${nxParallel} --maxParallel=${nxMaxParallel} $NX_OPTIONS`,
        {
          env: skipCache
            ? {
                ...process.env,
                NX_OPTIONS: `${process.env.NX_OPTIONS || ''} --skip-nx-cache`,
              }
            : process.env,
        },
      )
    } catch (err) {
      console.error(`Error running command: ${err.message}`)
      exitCode = err.code || 1
      break
    }
  }

  // In NX 21.2.2 daemon slows down significantly after codegen, so we restart it.
  await exec('nx daemon --stop')

  process.exit(exitCode)
}

main()
