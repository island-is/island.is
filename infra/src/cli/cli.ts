import yargs from 'yargs/yargs'
import { renderEnv } from './render-env'
import { renderUrls } from './render-urls'
import { renderSecretsCommand } from './render-secrets'
import { ChartName, ChartNames, OpsEnvNames } from '../uber-charts/all-charts'
import { OpsEnv } from '../dsl/types/input-types'
import { renderServiceEnvVars } from './render-env-vars'
import { renderLocalServices, runLocalServices } from './render-local-mocks'

const cli = yargs(process.argv.slice(2))
  .scriptName('yarn infra')
  .command(
    'render-env',
    'Render a chart for environment',
    (yargs) => {
      return yargs
        .option('env', { choices: OpsEnvNames, demandOption: true })
        .option('chart', { choices: ChartNames, demandOption: true })
    },
    async (argv) => {
      process.stdout.write(
        await renderEnv(argv.env as OpsEnv, argv.chart as ChartName),
      )
    },
  )
  .command(
    'render-urls',
    'Render urls from ingress for environment',
    (yargs) => {
      return yargs.option('env', { choices: OpsEnvNames, demandOption: true })
    },
    async (argv) => {
      await renderUrls(argv.env as OpsEnv)
    },
  )
  .command(
    'render-secrets',
    'Render secrets secrets needed by service',
    (yargs) => {
      return yargs.option('service', { demandOption: true })
    },
    async (argv) => {
      await renderSecretsCommand(argv.service as string)
    },
  )
  .command(
    'render-env-vars',
    'Render environment variables needed by service.\nThis is to be used when developing locally and loading of the environment variables for "dev" environment is needed.',
    (yargs) => {
      return yargs.option('service', { demandOption: true })
    },
    async (argv) => {
      await renderServiceEnvVars(argv.service as string)
    },
  )
  .command(
    'render-local-env [services...]',
    'Render environment variables needed by service.\nThis is to be used when developing locally and loading of the environment variables for "dev" environment is needed.',
    (yargs) => {
      return (
        yargs
          .positional('services', {
            type: 'string',
            array: true,
            demandOption: true,
          })
          .option('json', { type: 'boolean', default: false })
          .option('dry', { type: 'boolean', default: false })
          .option('no-update-secrets', {
            type: 'boolean',
            default: false,
            alias: ['nosecrets', 'no-secrets'],
          })
          // Custom check for 'services' since yargs lack built-in validation
          .check((argv) => {
            const svc = argv.services
            if (svc.length < 1) {
              throw new Error('You must pass at least one service to run!')
            } else {
              return true
            }
          })
      )
    },
    async (argv) => {
      await renderLocalServices({
        services: argv.services,
        dryRun: argv.dry,
        json: argv.json,
        print: true,
        noUpdateSecrets: argv['no-update-secrets'],
      })
    },
  )
  .command(
    'run-local-env [services...]',
    'Render environment and run the local environment.\nThis is to be used when developing locally and loading of the environment variables for "dev" environment is needed.',
    (yargs) => {
      return (
        yargs
          .positional('services', {
            type: 'string',
            array: true,
            demandOption: true,
          })
          .option('dependencies', { array: true, type: 'string', default: [] })
          .option('json', { type: 'boolean', default: false })
          .option('dry', { type: 'boolean', default: false })
          .option('no-update-secrets', {
            type: 'boolean',
            default: false,
            alias: ['nosecrets', 'no-secrets'],
          })
          .option('print', { type: 'boolean', default: false })
          .option('proxies', { type: 'boolean', default: false })
          .option('never-fail', {
            alias: 'nofail',
            type: 'boolean',
            default: false,
          })
          // Custom check for 'services' since yargs lack built-in validation
          .check((argv) => {
            const svc = argv.services
            if (svc.length < 1) {
              throw new Error('You must pass at least one service to run!')
            } else {
              return true
            }
          })
      )
    },
    async (argv) => {
      await runLocalServices(argv.services, argv.dependencies, {
        dryRun: argv.dry,
        json: argv.json,
        neverFail: argv['never-fail'],
        noUpdateSecrets: argv['no-update-secrets'],
        print: argv.print,
        startProxies: argv.proxies,
      })
    },
  )
  .strict()
  .demandCommand(1)
  .parse()
