import yargs from 'yargs/yargs'
import { renderEnv } from './render-env'
import { renderUrls } from './render-urls'
import { renderSecretsCommand } from './render-secrets'
import { ChartName, ChartNames, OpsEnvNames } from '../uber-charts/all-charts'
import { OpsEnv } from '../dsl/types/input-types'
import { renderServiceEnvVars } from './render-env-vars'
import { renderLocalServices, runLocalServices } from './render-local-mocks'
import { createPreReleaseBranch } from './release-flow'

yargs(process.argv.slice(2))
  .command(
    'branch',
    'Create a pre-release branch',
    (yargs) =>
      yargs
        .option('m', {
          alias: 'max-minor',
          describe: 'Maximum minor version number',
          type: 'number',
          default: 4,
        })
        .option('p', {
          alias: 'push-release-branch',
          describe: 'Push release branch to remote',
          type: 'boolean',
          default: false,
        })
        .option('i', {
          alias: 'ignore-existing-release',
          describe: 'Ignore existing release branch',
          type: 'boolean',
          default: false,
        })
        .option('l', {
          alias: 'local-version',
          describe: 'Use local versioning',
          type: 'boolean',
          default: false,
        })
        .option('r', {
          alias: 'release-version',
          describe: 'Set a specific release version',
          type: 'string',
        }),
    (args) => {
      createPreReleaseBranch({
        maxMinor: args.m,
        pushReleaseBranch: args.p,
        ignoreExistingRelease: args.i,
        localVersion: args.l,
        releaseVersion: args.r,
      })
    },
  )
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
    'render-local-env',
    'Render environment variables needed by service.\nThis is to be used when developing locally and loading of the environment variables for "dev" environment is needed.',
    (yargs) => {
      return yargs
        .option('service', { demandOption: true, array: true, type: 'string' })
        .option('json', { type: 'boolean', default: false })
        .option('dry', { type: 'boolean', default: true })
        .option('no-update-secrets', { type: 'boolean', default: false })
    },
    async (argv) =>
      await renderLocalServices({
        services: argv.service,
        dryRun: argv.dry,
        json: argv.json,
        print: true,
        noUpdateSecrets: argv['no-update-secrets'],
      }),
  )
  .command(
    'run-local-env',
    'Render environment and run the local environment.\nThis is to be used when developing locally and loading of the environment variables for "dev" environment is needed.',
    (yargs) => {
      return yargs
        .option('service', { array: true, type: 'string', demandOption: true })
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
    },
    async (argv) =>
      await runLocalServices(argv.service, argv.dependencies, {
        dryRun: argv.dry,
        json: argv.json,
        neverFail: argv['never-fail'],
        noUpdateSecrets: argv['no-update-secrets'],
        print: argv.print,
        startProxies: argv.proxies,
      }),
  )
  .help('h')
  .alias('h', 'help')
  .demandCommand(1)
  .parse()
