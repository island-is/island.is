import { argv } from 'process'
import yargs from 'yargs'

const unicornApps = ['unicorn-app']

export interface AffectedProjects {
  affected: string[]
}

yargs(process.argv.slice(2))
  .command<AffectedProjects>(
    ['unicorn-affected'],
    'Returns true if the affected projects contain a unicorn',
    (yargs) =>
      yargs.option('affected', {
        requiresArg: true,
        alias: ['affected'],
        type: 'array',
        demandOption: true,
        default: [],
      }),
    function (args: AffectedProjects) {
      console.log(args.affected.some((item) => unicornApps.includes(item)))
    },
  )
  .parse()
