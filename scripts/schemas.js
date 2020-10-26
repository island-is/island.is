const { stat, writeFile } = require('fs')
const { exec } = require('child_process')
const { promisify } = require('util')

/**
 * We need to create this file manually with a dummy content because
 * the api needs it to build and generate the first schema file.
 */
const SCHEMA_PATH = 'libs/api/schema/src/lib/schema.d.ts'

/**
 * See SCHEMAS.md to setup your project with auto-generated schemas files
 */
const TARGETS = [
  'schemas/build-openapi', // Output openapi.yaml
  'schemas/openapi-generator', // Output gen/fetch/* based on openapi.yaml to run openapi-generator
  'schemas/build-schema', // Output api.graphql based on graphql app modules
  'schemas/codegen', // Output clients schemas (*.d.ts) based on codegen.yml
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
    console.log(`--> Running command for ${target}\n`)

    try {
      const cmd = nx(target)
      const { stdout, stderr } = await promisify(exec)(cmd)

      console.log(stdout)

      if (stderr) {
        console.error(`Error while running generate-schemas: ${stderr}`)
      }
    } catch (err) {
      console.error(`Error while running generate-schemas: ${err}`)
      process.exit(err.code)
    }
  }
}

main()
