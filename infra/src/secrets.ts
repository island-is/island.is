import { SSM } from '@aws-sdk/client-ssm'
import yargs from 'yargs'
import { OpsEnv } from './dsl/types/input-types'
import { Envs } from './environments'
// import { serializeService } from './dsl/output-generators/map-to-helm-values'
import {
  ChartName,
  Charts,
  Deployments,
  OpsEnvNames,
} from './uber-charts/all-charts'
import { renderHelmServices } from './dsl/exports/helm'
import { logger } from './common'
import { hideBin } from 'yargs/helpers'

interface GetArguments {
  key: string
}

interface StoreArguments extends GetArguments {
  secret: string
}

interface DeleteArguments {
  prefix: string
}

const config = {
  region: 'eu-west-1',
}

const ssm = new SSM(config)
yargs(hideBin(process.argv))
  .command(
    'get-all-required-secrets',
    'get all required secrets from all charts',
    { env: { type: 'string', demand: true, choices: OpsEnvNames } },
    async (p) => {
      logger.info(`Listing all secrets for env:${p.env}`)
      const services = (
        await Promise.all(
          Object.entries(Charts)
            .map(([chartName, chart]) => ({
              services: chart[p.env as OpsEnv],
              chartName: chartName as ChartName,
            }))
            .flatMap(async ({ services, chartName }) => {
              logger.info(`Getting secrets for ${chartName} in ${p.env}`)
              return Object.values(
                (
                  await renderHelmServices(
                    Envs[Deployments[chartName][p.env as OpsEnv]],
                    Charts[chartName][p.env as OpsEnv],
                    services,
                    'no-mocks',
                  )
                ).services,
              )
            }),
        )
      ).flat()

      const secrets = services.flatMap((s) => {
        return Object.values(s.secrets)
      })
      // Actually log to stdout
      console.log([...new Set(secrets)].join('\n'))
    },
  )
  .command(
    'get <key>',
    'get secret',
    {
      key: { type: 'string', demand: true },
    },
    async ({ key }: GetArguments) => {
      const parameterInput = {
        Name: key,
        WithDecryption: true,
      }

      const { Parameter } = await ssm.getParameter(parameterInput)
      if (Parameter) {
        if (Parameter.Value && Parameter.Value.length > 0) {
          console.log(Parameter.Value)
        } else {
          logger.error('Failed to get secret', {
            error: Parameter.SourceResult,
          })
        }
      }
    },
  )
  .command(
    'store <key> <secret>',
    'store secret',
    {
      key: { type: 'string', demand: true },
      secret: { type: 'string', demand: true },
    },
    async ({ key, secret }: StoreArguments) => {
      await ssm.putParameter({
        Name: key,
        Value: secret,
        Type: 'SecureString',
      })
      logger.debug('Done!')
    },
  )

  .command(
    'delete <prefix>',
    'delete secrets by prefix',
    {
      prefix: { type: 'string', demand: true },
    },
    async ({ prefix }: DeleteArguments) => {
      const { Parameters } = await ssm.describeParameters({
        ParameterFilters: [
          { Key: 'Name', Option: 'BeginsWith', Values: [prefix] },
        ],
      })
      if (Parameters && Parameters.length > 0) {
        logger.debug(
          `Parameters to destroy: ${Parameters.map(({ Name }) => Name)}`,
        )
        await Promise.all(
          Parameters.map(({ Name }) =>
            Name
              ? ssm.deleteParameter({ Name }).promise()
              : new Promise((resolve) => resolve(true)),
          ),
        )
      }
    },
  )
  .demandCommand().argv
