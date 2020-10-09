const fs = require('fs')
const { exec } = require('child_process')
const { promisify } = require('util')

const HEAD = process.env.HEAD
const BASE = process.env.BASE

const SCHEMA_PATH = 'libs/api/schema/src/lib/schema.d.ts'
const YARN_COMMANDS = [
  'yarn nx run application-system-api:build-schema',
  'yarn nx run api-domains-application:codegen',
  'yarn nx run api:build-schema',
  `yarn affected:schemas --head=${HEAD} --base=${BASE}`,
]

const main = async () => {
  if (!(await promisify(fs.exists)(SCHEMA_PATH))) {
    await promisify(fs.writeFile)(SCHEMA_PATH, 'export default () => {}')
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
