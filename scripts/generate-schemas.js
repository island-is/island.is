const { access, writeFile, constants } = require('fs')
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
 * -> You need to add a "openapi-yaml" script to your workspace project to create the openapi.yaml file (template here: TODO)
 * -> You can use the openapi.yml file to generate the gen/fetch folder along openapi-generator (template here: TODO)
 *
 * - Your project depends on graphql:
 * ->
 *
 * - Your project depends on react and is consuming one of them:
 * ->
 */
const YARN_COMMANDS = [
  'nx run-many --target=openapi-yaml --all --with-deps --parallel --maxParallel=6', // First we generate all the openapi.yaml files needed to run openapi-generate commands
  'nx run-many --target=openapi-generator --all --with-deps --parallel --maxParallel=6', // We then run openapi-generator than depends on openapi.yaml that have been generated just before
  'nx run-many --target=postinstall --all --with-deps',
]

const main = async () => {
  if (!(await promisify(access)(SCHEMA_PATH, constants.F_OK))) {
    await promisify(writeFile)(SCHEMA_PATH, 'export default () => {}')
  }

  for (const cmd of YARN_COMMANDS) {
    console.log(`Running ${cmd}`)

    try {
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
