import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export const processJob = () =>
  yargs(hideBin(process.argv))
    .option('job', {
      string: true,
      choices: ['energy-fund-import', 'grant-import'] as const,
      description: 'Indicate what import application should run',
    })
    .parseSync().job
