import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export const processJob = () =>
  yargs(hideBin(process.argv))
    .option('job', {
      string: true,
      choices: ['worker', 'server'] as const,
      description: 'Indicate if application should run as a worker or server',
    })
    .parseSync().job
