const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const winston = require('winston')
const { combine, printf, colorize } = winston.format
const { Console } = winston.transports

const loadCommands = () => {
  try {
    const packageJsonPath = path.join(__dirname, '..', 'infra', 'package.json')
    const packageJsonContents = fs.readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(packageJsonContents)
    const cmds = Object.keys(packageJson.scripts)
    return cmds
  } catch (e) {
    throw new Error(`Failed to load commands: ${e.message}`)
  }
}

const formatMessage = winston.format((info) => {
  const { warningType, title, description } = info.message
  info.message = `[${warningType}Warning]: ${title}\n\n${description}\n`
  return info
})

const logger = winston.createLogger({
  level: 'warn',
  format: combine(
    formatMessage(),
    colorize({ all: true }),
    printf((info) => `${info.message}`),
  ),
  transports: [new Console()],
})

yargs(hideBin(process.argv))
  .command({
    command: 'install',
    describe: 'Install infra dependencies',
    handler: (argv) => {
      const arg = argv['_']
      const run = spawn(`yarn`, ['./infra', arg], {
        shell: true,
        stdio: 'inherit',
      })

      run.on('exit', (code) => {
        if (code !== 0) process.exit(code)
      })
    },
  })
  .command(
    '$0',
    'infra',
    () => {},
    (argv) => {
      const cmds = loadCommands()
      const [cmd, ...rest] = argv._ ?? []
      const args = cmds.includes(cmd) ? [cmd, ...rest] : ['cli', ...rest]
      if (!cmd) {
        logger.warn({
          warningType: 'Deprecation',
          title: '"yarn infra" command will not install dependencies',
          description:
            'For better separation of installing and running the infra cli, install the infra deps separately:\n\nyarn infra install',
        })
      }
      const run = spawn(`yarn`, ['./infra', args], {
        shell: true,
        stdio: 'inherit',
      })
      run.on('exit', (code) => {
        if (code !== 0) process.exit(code)
      })
    },
  )
  .help()
  .parse()
