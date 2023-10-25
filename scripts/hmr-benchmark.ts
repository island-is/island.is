import path from 'path'
import { spawn, ChildProcess, exec } from 'child_process'
import { watch } from 'chokidar'
import fsPromises from 'fs/promises'
import chalk from 'chalk'
import yargs from 'yargs'

const processManager = {
  nxProcess: null as unknown as ChildProcess,

  start(appName: string) {
    this.nxProcess = spawn('yarn', ['nx', 'serve', appName], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    })
  },

  stop() {
    if (this.nxProcess) {
      this.nxProcess.kill()
    }
  },
}

const getProjectRootDirectory = (projectName: string): Promise<string> => {
  console.log(chalk.cyan(`Resolving sourceRoot for ${projectName} ...`))
  return new Promise((resolve, reject) => {
    exec(
      `yarn nx show project ${projectName} | jq -r '.sourceRoot'`,
      (error, stdout, stderr) => {
        if (error || stderr || !stdout) {
          reject(
            new Error(
              `Error getting project root directory: ${error || stderr}`,
            ),
          )
          return
        }

        resolve(stdout.trim())
      },
    )
  })
}
const startBenchmark = async (
  appName: string,
  watchMessage: string,
  logfile: string,
) => {
  const directoryPath = await getProjectRootDirectory(appName)
  console.log(
    chalk.yellow(`Watching for changes in directory: ${directoryPath}`),
  )
  console.log(chalk.yellow(`Calculating ${appName} startup duration ...`))
  const watcher = watch(directoryPath, { usePolling: false })

  let startTime: number
  const scriptStartTime = Date.now()

  watcher.on('change', (path) => {
    startTime = Date.now()
    console.log(
      chalk.blueBright(`[Start: ${new Date(startTime).toLocaleTimeString()}]`),
      chalk.yellow(`File changed at '${path}', waiting for NX reload...`),
    )
  })

  processManager.start(appName)

  let isFirstReload = true

  if (processManager.nxProcess && processManager.nxProcess.stdout) {
    processManager.nxProcess.stdout.on('data', async (data) => {
      if (data.toString().includes(watchMessage)) {
        const endTime = Date.now()
        const duration = startTime
          ? (endTime - startTime) / 1000
          : (endTime - scriptStartTime) / 1000

        if (isFirstReload) {
          console.log(
            chalk.blueBright(
              `[Startup: ${new Date(endTime).toLocaleTimeString()}]`,
            ),
            chalk.green(
              `Initial start duration: ${duration.toFixed(3)} seconds`,
            ),
          )
          isFirstReload = false
        } else {
          console.log(
            chalk.blueBright(
              `[End: ${new Date(endTime).toLocaleTimeString()}]`,
            ),
            chalk.green(
              `Duration after changes: ${duration.toFixed(3)} seconds`,
            ),
          )
        }

        await fsPromises.appendFile(
          logfile,
          `Duration: ${duration.toFixed(3)} seconds\n`,
        )
      }
    })
  }
}

interface Args {
  app: string
  message: string
  logfile: string
}
const argv = yargs
  .options({
    app: {
      description: 'Name of the NX app to benchmark',
      type: 'string',
      demandOption: true,
    },
    message: {
      description: 'Message to watch in the logs indicating successful reload',
      type: 'string',
      default: 'Nest application successfully started',
    },
    logfile: {
      description: 'Path for the log file to store benchmark results',
      type: 'string',
      default: path.join(__dirname, '..', 'hmr.log'),
    },
  })
  .help()
  .alias('help', 'h')
  .strict()
  .parse() as Args

const HMR_LOG_PATH = './hmr.log'

startBenchmark(argv.app, argv.message, argv.logfile)

process.on('SIGINT', () => {
  processManager.stop()
  process.exit()
})
