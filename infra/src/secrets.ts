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
      const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))

      const { prefix } = argv as DeleteArguments
      let nextToken: string | undefined = undefined
      let parameterList: any = []

      logger.info(`Deleting all parameters with prefix:`, { prefix })

      do {
        try {
          let response: any = await ssm
            .describeParameters({
              ParameterFilters: [
                { Key: 'Name', Option: 'BeginsWith', Values: [prefix] },
              ],
              NextToken: nextToken,
            })
            .promise()

          nextToken = response.NextToken

          if (response.Parameters && response.Parameters.length > 0) {
            parameterList = parameterList.concat(response.Parameters)
          }
        } catch (error: any) {
          let code = error?.code
          if (
            code &&
            (code === 'ThrottlingException' ||
              code === 'TooManyRequestsException')
          ) {
            logger.info(
              'Throttled while listing parameters; backing off and retrying',
            )
            await wait(1000)
            continue
          }
          throw error
        }
      } while (nextToken)

      if (parameterList && parameterList.length > 0) {
        logger.debug(
          `Parameters to destroy: ${parameterList.map(
            ({ Name }: any) => Name,
          )}`,
        )

        const names: string[] = parameterList
          .map(({ Name }: any) => Name)
          .filter(Boolean)

        const batchSize = 10
        const maximumAttempts = 5
        for (let i = 0; i < names.length; i += batchSize) {
          const batch = names.slice(i, i + batchSize)

          let attempts = 0

          while (true) {
            try {
              let resp = await ssm.deleteParameters({ Names: batch }).promise()
              if (resp.InvalidParameters && resp.InvalidParameters.length > 0) {
                logger.error('Invalid parameters', {
                  invalid: resp.InvalidParameters,
                })
              }
              break
            } catch (error: any) {
              let code = error?.code
              if (
                code === 'ThrottlingException' ||
                code === 'TooManyRequestsException'
              ) {
                attempts++
                if (attempts > maximumAttempts) {
                  logger.error(
                    'Failed to delete parameters after multiple attempts',
                    {
                      error,
                      batch,
                    },
                  )
                  break
                }

                logger.info(
                  'Throttled while deleting parameters; backing off and retrying',
                  {
                    attempts,
                  },
                )
                await wait(1000 * attempts)
                continue
              } else if (code === 'ParameterNotFound') {
                logger.warn('Parameter not found while deleting, ignoring')
              }
              logger.error('Exception while deleting parameters', { error })
              break
            }
          }
        }
      }
    },
  })
  .demandCommand().argv
