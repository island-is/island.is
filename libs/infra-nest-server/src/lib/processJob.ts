import yargs from 'yargs'

export const processJob = () =>
  yargs(process.argv.slice(2))
    .option('job', {
      string: true,
      choices: ['worker', 'server', 'cleanup'] as const,
      description: 'Indicate if application should run as a worker or server',
    })
    .parseSync().job
