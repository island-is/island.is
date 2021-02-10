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
  .option('folder', {
    alias: 'f',
    description: 'Dist folder of the app. Only needed for React apps.',
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

// Validate that the folder option is set when type=react
if (argv.type === 'react' && !argv.folder) {
  throw new Error('Missing required option: folder')
}

// Strip '-e2e' ending to get the target app name
const target = argv.name.replace('-e2e', '')

// We run the e2e tests on production built application
// prettier-ignore
const CMD = {
  BUILD: `yarn nx run ${target}:build:production${argv['skip-cache'] ? ' --skip-nx-cache' : ''}`,
  SERVE: [
    'node',
    [
      'scripts/static-serve.js',
      '-p', argv.port,
      '-d', argv.folder,
      '-b', argv['base-path']
    ]
  ],
  TEST: `yarn nx run ${argv.name}:e2e:production --headless --production --base-url http://localhost:${argv.port}${
      argv.ci ? 
        ` --record --group=${argv.name}` :
        ''
    }${
      argv['skip-cache'] ?
        ' --skip-nx-cache' :
        ''
    }`,
}

const build = async () => {
  console.log(`Building ${target}...`)

  try {
    const buildResult = await pexec(CMD.BUILD)
    console.log(buildResult.stdout)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Build complete...')
}

const serve = () => {
  let child = undefined

  if (argv.type === 'react') {
    console.log('Starting static serve for React app in a child process...')
    // Start static-serve
    child = spawn(CMD.SERVE[0], CMD.SERVE[1])
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
  }

  return child
}

const main = async () => {
  let exitCode = 0
  await build()
  let serveChild = serve()

  console.log(`Starting test command \n${CMD.TEST}`)

  try {
    const testResult = await pexec(CMD.TEST)
    console.log(testResult.stdout)
  } catch (err) {
    exitCode = 1
    console.log(err)
  }

  if (serveChild) {
    console.log('Clean up serve process...')
    serveChild.kill()
  }

  process.exit(exitCode)
}

// Entry point
main()
