import yargs from 'yargs/yargs'
import { renderEnv } from './render-env'
import { renderServiceEnvVars } from './render-env-vars'
import { renderLocalServices } from './render-local-mocks'
import { renderSecretsCommand } from './render-secrets'
import { renderUrls } from './render-urls'
import {
  ChartNames,
  GetSecretsArgs,
  OpsEnv,
  OpsEnvNames,
  RenderEnvArgs,
  RenderLocalEnvArgs,
  RenderSecretsArgs,
  RenderUrlsArgs,
} from './types'
import { resetAllMappedFiles, updateSecretFiles } from './utils'

yargs(process.argv.slice(2))
  .usage('Usage: $0 <command> [options]')
  .scriptName('cli')
  .command<RenderEnvArgs>(
    'render-env',
    'Render a chart for environment',
    (yargs) => {
      return yargs
        .option('env', { choices: OpsEnvNames, demandOption: true })
        .option('chart', { choices: ChartNames, demandOption: true })
    },
    async (argv) => {
      process.stdout.write(await renderEnv(argv.env, argv.chart))
    },
  )
  .command<RenderUrlsArgs>(
    'render-urls',
    'Render urls from ingress for environment',
    (yargs) => {
      return yargs.option('env', { choices: OpsEnvNames, demandOption: true })
    },
    async (argv) => {
      await renderUrls(argv.env as OpsEnv)
    },
  )
  .command<RenderSecretsArgs>(
    'render-secrets',
    'Render secrets secrets needed by service',
    (yargs) => {
      return yargs.option('service', { demandOption: true })
    },
    async (argv) => {
      await renderSecretsCommand(argv.service)
    },
  )
  .command<RenderSecretsArgs>(
    'render-env-vars',
    'Render environment variables needed by service.\nThis is to be used when developing locally and loading of the environment variables for "dev" environment is needed.',
    (yargs) => {
      return yargs.option('service', { demandOption: true })
    },
    async (argv) => {
      await renderServiceEnvVars(argv.service)
    },
  )
  .command<RenderLocalEnvArgs>(
    'render-local-env',
    'Render environment variables needed by service.\nThis is to be used when developing locally and loading of the environment variables for "dev" environment is needed.',
    (yargs) => {
      return yargs.option('service', { demandOption: true, array: true })
    },
    async (argv) => {
      console.log(await renderLocalServices(argv.service as string[]))
    },
  )
  .command<GetSecretsArgs>(
    'get-secrets',
    'Fetch secret environment variables',
    (yargs) => {
      return yargs
        .option('services', {
          array: true,
          default: [],
          desc: 'Services to fetch secrets for',
        })
        .alias('service', 'services')
        .option('reset', {
          type: 'boolean',
          default: false,
          desc: 'Discard your old secrets files',
        })
        .alias('fresh', 'reset')
        .option('help', { type: 'boolean' })
        .alias('h', 'help')
        .demandCommand(0)
    },
    async (argv) => {
      // TODO: Move all logic here to own function
      for (const arg of argv._.slice(1).map((s) => s.toString()))
        argv.services.push(arg)
      if (argv.reset) {
        resetAllMappedFiles()
      }
      if (!argv.services.length) {
        console.log('No services specified, nothing to do')
        process.exit(0)
      }
      const { changes, failedServices } = await updateSecretFiles(
        argv.services || [],
      )
      console.log(
        `Updated ${changes.changed} and added ${changes.added} secrets`,
      )
      if (failedServices.length > 0) {
        console.log(
          `Failed to update secrets for ${failedServices
            .map((s) => `'${s}'`)
            .join(', ')}`,
        )
        process.exit(1)
      }
      process.exit(0)
    },
  )
  .demandCommand(1)
  .parse()
