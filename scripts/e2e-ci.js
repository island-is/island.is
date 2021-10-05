const yargs = require('yargs')
const { spawn } = require('child_process')
const { exec } = require('./utils')

// Setup command line args
// prettier-ignore
const argv = yargs
  .option('name', {
    alias: 'n',
    description: 'Name of the e2e project to test.',
    demandOption: true,
    requiresArg: true,
    type: 'string'
  })
  .option('type', {
    alias: 't',
    choices: ['next', 'react'],
    default: 'next',
    description: 'Type of app.',
    type: 'string',
  })
  .option('port', {
    alias: 'p',
    default: '4200',
    description: 'Port number of the app.',
    type: 'number',
  })
  .option('dist', {
    alias: 'd',
    description: 'Dist folder of the app. Only needed for React apps.',
    demandOption: true,
    requiresArg: true,
    type: 'string',
  })
  .option('base-path', {
    alias: 'b',
    default: '/',
    description: 'Base path of the app if it is deployed to a sub-folder.',
    requiresArg: true,
    type: 'string'
  })
  .option('ci', {
    alias: 'c',
    description: 'Flag to indicate if the script is being run from CI platform.',
    type: 'boolean',
  })
  .option('skip-cache', {
    alias: 's',
    description: 'Add Nx arguments to skip Nx cache',
    type: 'boolean',
  })
  .help()
  .alias('help', 'h')
  .argv

// Strip '-e2e' ending to get the target app name
const target = argv.name.replace('-e2e', '')
const isReact = argv.type === 'react'

// We run the e2e tests on production built application
// NOTE: When the repo was upgraded to Nx 12.9.0 with webpack5 there was a unresolved bug for React apps
// when running e2e on production build with API_MOCKS=true. So for a workaround we don't do production build
// for React apps (at the time of writing were only service-portal and application-system-form).
// prettier-ignore
const CMD = {
  BUILD: `yarn nx run ${target}:build${isReact ? '' : ':production'}${argv['skip-cache'] ? ' --skip-nx-cache' : ''}`,
  EXTRACT_ENV: `scripts/dockerfile-assets/bash/extract-environment.sh ${argv.dist}`,
  SERVE_NEXT: [ `main.js` ],
  SERVE_REACT: ['scripts/static-serve.js', '-p', argv.port, '-d', argv.dist, '-b', argv['base-path']],
  TEST: `yarn nx run ${argv.name}:e2e:production --headless --production ${
    argv.ci ? `--record --group=${argv.name}` : ''}${
    argv['skip-cache'] ? ' --skip-nx-cache' : ''} ${process.env.E2E_BUILD_ID ? `--ciBuildId=${process.env.E2E_BUILD_ID}` : ''}`
}

const ENV = {
  SI_PUBLIC_CONFIGCAT_SDK_KEY: 'asdf',
}

const build = async () => {
  console.log(`Building ${target}...`)
  const start = new Date().getTime()

  try {
    await exec(CMD.BUILD)
  } catch (err) {
    console.log(err)
    process.exit(err.code)
  }

  const end = new Date().getTime()
  console.log(`Build complete in ${Math.round((end - start) / 1000)} seconds.`)
}

const extractEnv = async () => {
  console.log(`Extracting environment for ${target}...`)

  try {
    await exec(CMD.EXTRACT_ENV, {
      env: { ...process.env, ...ENV },
    })
  } catch (err) {
    console.log(err)
    process.exit(err.code)
  }
}

const serve = () => {
  console.log(`Starting serve for ${argv.type} app in a child process...`)
  // Start static-serve
  let child = spawn('node', CMD[`SERVE_${argv.type.toUpperCase()}`], {
    stdio: 'inherit',
    cwd: `${process.cwd()}/${!isReact ? argv.dist : ''}`,
  })
  console.log(`Serving target project in a child process: ${child.pid}`)

  return child
}

const test = () => {
  return new Promise((resolve, reject) => {
    console.log(`Starting test command \n${CMD.TEST}`)
    let successful = false

    try {
      let child = spawn(CMD.TEST, { stdio: 'pipe', shell: true })

      child.stdout.on('data', (data) => {
        // Tests can fail but the command still exits normally
        // So to be sure that all tests where successful we check
        // for the string 'All specs passed!' written to stdout by cypress runner.
        console.log(`${data}`)
        if (data.includes('All specs passed!')) {
          successful = true
        }
      })

      child.stderr.on('data', (data) => {
        console.log(`${data}`)
      })

      child.on('close', (code, signal) => {
        if (successful) {
          resolve()
        } else {
          reject('Some tests failed!')
        }
      })

      child.on('error', (err) => {
        reject(err)
      })
    } catch (err) {
      reject(err)
    }
  })
}

const main = async () => {
  let exitCode = 0
  let serveChild

  try {
    await build()
    await extractEnv()
    serveChild = serve()
    await test()
  } catch (err) {
    exitCode = 1
    console.log(err)
  }

  if (serveChild) {
    console.log('Clean up serve process...')
    let killed = serveChild.kill()
    console.log(`Child process cleaned up successfully: ${killed}`)
  }

  console.log(`Exiting main process with code ${exitCode}`)
  process.exit(exitCode)
}

// Entry point
main()
