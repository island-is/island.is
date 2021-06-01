const yargs = require('yargs')
const { spawn, exec } = require('child_process')
const { promisify } = require('util')

const pexec = promisify(exec)

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

// We run the e2e tests on production built application
// prettier-ignore
const CMD = {
  BUILD: `yarn nx run ${target}:build:production${argv['skip-cache'] ? ' --skip-nx-cache' : ''}`,
  EXTRACT_ENV: `scripts/dockerfile-assets/bash/extract-environment.sh ${argv.dist}`,
  SERVE_NEXT: [
    `${argv.dist}/main.js`
  ],
  SERVE_REACT: [
    'scripts/static-serve.js',
    '-p', argv.port,
    '-d', argv.dist,
    '-b', argv['base-path']
  ],
  TEST: `yarn nx run ${argv.name}:e2e:production --headless --production${
      argv.ci ?
        ` --record --group=${argv.name}` :
        ''
    }${
      argv['skip-cache'] ?
        ' --skip-nx-cache' :
        ''
    }`,
}

const ENV = {
  SI_PUBLIC_CONFIGCAT_SDK_KEY: 'asdf',
}

const build = async () => {
  console.log(`Building ${target}...`)
  const start = new Date().getTime()

  try {
    const buildResult = await pexec(CMD.BUILD)
    console.log(buildResult.stdout)
  } catch (err) {
    console.log(err.stdout)
    console.log(err.stderr)
    process.exit(1)
  }

  const end = new Date().getTime()
  console.log(`Build complete in ${Math.round((end - start) / 1000)} seconds.`)
}

const extractEnv = async () => {
  console.log(`Extracting environment for ${target}...`)

  try {
    const result = await pexec(CMD.EXTRACT_ENV, {
      env: { ...process.env, ...ENV },
    })
    console.log(result.stdout)
  } catch (err) {
    console.log(err.stdout)
    console.log(err.stderr)
    process.exit(1)
  }
}

const serve = () => {
  console.log(`Starting serve for ${argv.type} app in a child process...`)
  // Start static-serve
  let child = spawn('node', CMD[`SERVE_${argv.type.toUpperCase()}`])
  console.log(`Serving target project in a child process: ${child.pid}`)

  child.stdout.on('data', (data) => {
    console.log(`Child process ${child.pid} output: ${data}`)
  })

  child.stderr.on('data', (data) => {
    console.log(`Child process ${child.pid} error: ${data}`)
  })

  child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`)
  })

  return child
}

const main = async () => {
  let exitCode = 0
  await build()
  await extractEnv()
  let serveChild = serve()

  console.log(`Starting test command \n${CMD.TEST}`)

  try {
    const testResult = await pexec(CMD.TEST)
    console.log(testResult.stdout)
    console.log(testResult.stderr)

    // Tests can fail without the command exiting with code 1
    // So to be sure that all tests where successful we check
    // for the string 'All specs passed!'
    if (!testResult.stdout.includes('All specs passed!')) {
      console.log('Tests have failed. See output above for further details.')
      exitCode = 1
    }
  } catch (err) {
    exitCode = 1
    console.log(err.stdout)
    console.log(err.stderr)
  }

  if (serveChild) {
    console.log('Clean up serve process...')
    serveChild.kill()
  }

  process.exit(exitCode)
}

// Entry point
main()
