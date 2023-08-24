import yargs from 'yargs/yargs'
import { renderEnv } from './render-env'
import { renderUrls } from './render-urls'
import { renderSecretsCommand } from './render-secrets'
import {
  ChartNames,
  OpsEnvNames,
  OpsEnv,
  RenderEnvArgs,
  RenderUrlsArgs,
  RenderSecretsArgs,
  RenderLocalEnvArgs,
  GetSecretsArgs,
} from './types'
import { renderServiceEnvVars } from './render-env-vars'
import { renderLocalServices } from './render-local-mocks'
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
        .option('services', { demandOption: true, array: true })
        .option('reset', { type: 'boolean', default: false })
        .option('help', { type: 'boolean' })
    },
    async (argv) => {
      if (argv.reset) {
        resetAllMappedFiles()
      }
      await updateSecretFiles(argv.services)
    },
  )
  .demandCommand(1)
  .parse()
