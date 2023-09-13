import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv))
  .option('job', {
    string: true,
    choices: ['worker', 'server'],
    description:
      'Indicate if application-system-api should run as a worker or server',
  })
  .parseSync()

if (argv.job === 'worker') {
  import('./worker').then((app) => {
    app.worker()
  })
} else {
  import('./app').then((app) => {
    app.bootstrapServer()
  })
}
