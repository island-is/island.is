const { stat, writeFile } = require('fs')
const { exec } = require('child_process')
const { promisify } = require('util')

/**
 * We need to create this file manually with a dummy content because
 * the api needs it to build and generate the first schema file.
 */
const SCHEMA_PATH = 'libs/api/schema/src/lib/schema.d.ts'

/**
 * Three options:
 * - Your project depends on open api specification:
 * -> You need to add a "build-open-api" script to your workspace project to create the openapi.yaml file (template here: TODO)
 * -> You can use the openapi.yml file to generate the gen/fetch folder along openapi-generator (template here: TODO)
 *
 * - Your project depends on graphql:
 * ->
 *
 * - Your project depends on react and is consuming one of them:
 * ->
 */
const TARGETS = [
  'build-open-api', // First we generate all the openapi.yaml files needed to run openapi-generate commands
  'openapi-generator', // We then run openapi-generator than depends on openapi.yaml that have been generated just before
  'build-schema',
  'postinstall',
]

const nx = (target) =>
  `nx run-many --target=${target} --all --with-deps --parallel --maxParallel=6`

const fileExists = async (path) =>
  !!(await promisify(stat)(path).catch((_) => false))

const main = async () => {
  if (!fileExists(SCHEMA_PATH)) {
    await promisify(writeFile)(SCHEMA_PATH, 'export default () => {}')
  }

  for (const target of TARGETS) {
    console.log(`--> Running command for ${target}`)

    try {
      const cmd = nx(target)
      const { stdout, stderr } = await promisify(exec)(cmd)
      console.log(`stdout: ${stdout}`)

      if (stderr) {
        console.error(`stderr: ${stderr}`)
      }
    } catch (err) {
      console.error(err)
      process.exit(err.code)
    }
  }
}

main()
