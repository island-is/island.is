import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export const processJob = () =>
  yargs(hideBin(process.argv))
    .option('job', {
      string: true,
      choices: [
        'worker',
        'server',
        'cleanup',
        'metrics',
        'external-metrics',
      ] as const,
      description: 'Select the server, worker, cleanup or metrics entrypoint',
    })
    .parseSync().job
