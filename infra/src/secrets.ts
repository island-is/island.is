import AWS from 'aws-sdk'
import yargs, { ArgumentsCamelCase } from 'yargs'
import { OpsEnv } from './dsl/types/input-types'
import { Envs } from './environments'
import {
  ChartName,
  Charts,
  Deployments,
  OpsEnvNames,
} from './uber-charts/all-charts'
import { renderHelmServices } from './dsl/exports/helm'
import { logger } from './common'
import { hideBin } from 'yargs/helpers'

interface GetArguments extends ArgumentsCamelCase {
  key: string
}

interface StoreArguments extends ArgumentsCamelCase {
  key: string
  secret: string
}

interface DeleteArguments extends ArgumentsCamelCase {
  prefix: string
}

const config = {
  region: 'eu-west-1',
}

const ssm = new AWS.SSM(config)
yargs(hideBin(process.argv))
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
  .command({
    command: 'get <key>',
    describe: 'get secret',
    builder: (yargs) => yargs,
    handler: async (argv) => {
      const { key } = argv as GetArguments
      const parameterInput = {
        Name: key,
        WithDecryption: true,
      }

      const { Parameter } = await ssm.getParameter(parameterInput).promise()
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
  })
  .command({
    command: 'store <key> <secret>',
    describe: 'store secret',
    builder: (yargs) => yargs,
    handler: async (argv) => {
      const { key, secret } = argv as StoreArguments
      await ssm
        .putParameter({
          Name: key,
          Value: secret,
          Type: 'SecureString',
        })
        .promise()
      logger.debug('Done!')
    },
  })

  .command({
    command: 'delete <prefix>',
    describe: 'delete secrets by prefix',
    builder: (yargs) => yargs,
    handler: async (argv) => {
      const { prefix } = argv as DeleteArguments
      let NextToken
      let ParameterList: any = []

      while (true) {
        let response = await ssm
          .describeParameters({
            ParameterFilters: [
              { Key: 'Name', Option: 'BeginsWith', Values: [prefix] },
            ],
            NextToken,
          })
          .promise()

          NextToken = response.NextToken

          if (response.Parameters && response.Parameters.length > 0) {
            ParameterList = ParameterList.concat(response.Parameters)
          }
          if (!NextToken || NextToken == undefined || NextToken == null || NextToken == '') {
            break
          }
          
      }
      if (ParameterList && ParameterList.length > 0) {
        logger.debug(
          `Parameters to destroy: ${ParameterList.map(({ Name }) => Name)}`,
        )
        await Promise.all(
          ParameterList.map(({ Name }) =>
            Name
              ? ssm.deleteParameter({ Name }).promise()
              : new Promise((resolve) => resolve(true)),
          ),
        )
      }
    },
  })
  .demandCommand().argv
