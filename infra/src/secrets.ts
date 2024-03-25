import AWS from 'aws-sdk'
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

const { hideBin } = require('yargs/helpers')

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

const requiredEnvVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_SESSION_TOKEN',
]

const checkEnvVariables = () => {
  let allEnvVarsSet = true
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      logger.error(`Error: The environment variable ${varName} is not set.`)
      allEnvVarsSet = false
    }
  })
  return allEnvVarsSet
}

const ssm = new AWS.SSM(config)
yargs(hideBin(process.argv))
  .middleware((argv) => {
    if (!checkEnvVariables()) {
      logger.error('Exiting due to missing environment variables.')
      process.exit(1)
    }
  })
  .command(
    'get-all-required-secrets',
    'get all required secrets from all charts',
    { env: { type: 'string', demand: true, choices: OpsEnvNames } },
    async (p) => {
      const services = (
        await Promise.all(
          Object.entries(Charts)
            .map(([chartName, chart]) => ({
              services: chart[p.env as OpsEnv],
              chartName: chartName as ChartName,
            }))
            .flatMap(async ({ services, chartName }) => {
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
      logger.debug([...new Set(secrets)].join('\n'))
    },
  )
  .command(
    'get <key>',
    'get secret',
    () => {},
    async ({ key }: GetArguments) => {
      const parameterInput = {
        Name: key,
        WithDecryption: true,
      }

      const { Parameter } = await ssm.getParameter(parameterInput).promise()
      if (Parameter) {
        if (Parameter.Value && Parameter.Value.length > 0) {
          console.log(Parameter.Value)
        } else {
          logger.error('Failed to get secret')
        }
      }
    },
  )
  .command(
    'store <key> <secret>',
    'store secret',
    () => {},
    async ({ key, secret }: StoreArguments) => {
      await ssm
        .putParameter({
          Name: key,
          Value: secret,
          Type: 'SecureString',
        })
        .promise()
      logger.debug('Done!')
    },
  )

  .command(
    'delete <prefix>',
    'delete secrets by prefix',
    () => {},
    async ({ prefix }: DeleteArguments) => {
      const { Parameters } = await ssm
        .describeParameters({
          ParameterFilters: [
            { Key: 'Name', Option: 'BeginsWith', Values: [prefix] },
          ],
        })
        .promise()
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
