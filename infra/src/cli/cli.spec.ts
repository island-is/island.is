import {
  GetParametersCommandInput,
  GetParametersCommandOutput,
  SSM,
} from '@aws-sdk/client-ssm'
import { renderSecretsCommand } from './render-secrets'
import { Charts } from '../uber-charts/all-charts'

import { ref, service, ServiceBuilder } from '../dsl/dsl'
import { EnvironmentConfig, EnvironmentServices } from '../dsl/types/charts'
import { generateOutput } from '../dsl/processing/rendering-pipeline'
import { getLocalrunValueFile } from '../dsl/value-files-generators/local-setup'
import { Localhost } from '../dsl/localhost-runtime'
import {
  LocalrunOutput,
  SecretOptions,
} from '../dsl/output-generators/map-to-localrun'
import path, { resolve } from 'path'
import { ChartName } from '../uber-charts/all-charts'

const MockEnvironment: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'mock01.mock.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  releaseName: 'webmock',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

jest.mock('../uber-charts/all-charts')
const ActualCharts: typeof Charts = jest.requireActual(
  '../uber-charts/all-charts',
).Charts

jest.mock('../dsl/consts', () => ({
  rootDir: '.',
  COMMON_SECRETS: {},
}))

jest.mock('@aws-sdk/client-ssm', () => ({
  SSM: jest.fn().mockImplementation(() => ({
    getParameters: jest.fn(() => ({
      Parameters: [
        {
          Name: '/k8s/my-service/A',
          Value: 'B',
        },
        {
          Name: '/k8s/my-service/REMOTE_URL',
          Value: 'https://www.website.tld/some/slug-path',
        },
        {
          Name: '/k8s/my-service/JSON_SECRET',
          Value: '{"key": ["value"]}',
        },
        {
          Name: '/k8s/my-service/ARRAY_SECRET',
          Value: '["ITEM1","ITEM2"]',
        },
      ],
    })),
  })),
}))

// Mock the renderSecretsCommand function

describe('render-secrets command', () => {
  const sut = service('my-service').env({
    A: 'A',
    B: ref((ctx) => `${ctx.svc('https://www.website.tld')}/some/slug-path`),
    C: '[redis.cluster.1,redis.cluster.2]',
  })
  let serviceDef: Awaited<ReturnType<typeof getLocalrunValueFile>>
  let apiServiceDef: ServiceBuilder<any>
  beforeEach(async () => {
    // jest.clearAllMocks()
    const runtime = new Localhost()
    serviceDef = await getLocalrunValueFile(
      runtime,
      await generateOutput({
        runtime: runtime,
        services: [sut],
        outputFormat: LocalrunOutput({ secrets: SecretOptions.noSecrets }),
        env: MockEnvironment,
      }),
    )
    apiServiceDef = ActualCharts.islandis.dev.filter(
      (svc) => svc.name() === 'api',
    )[0]
    Charts.islandis = {
      dev: [apiServiceDef],
      staging: [],
      prod: [],
    }

    const myServiceSetup = (): ServiceBuilder<'my-service'> =>
      service('my-service')
        .image('my-service')
        .namespace('my-service')
        .initContainer({
          containers: [
            { command: 'npx', args: ['sequelize-cli', 'db:migrate'] },
          ],
          postgres: {},
        })
        .env({
          IDENTITY_SERVER_ISSUER_URL: {
            dev: 'https://identity-server.dev01.devland.is',
            staging: 'https://identity-server.staging01.devland.is',
            prod: 'https://innskra.island.is',
          },
        })
        .secrets({
          A: '/k8s/my-service/A',
        })
        .liveness('/liveness')
        .readiness('/readiness')
        .grantNamespaces('islandis', 'application-system')

    Charts.islandis = {
      dev: [myServiceSetup(), apiServiceDef],
      staging: [],
      prod: [],
    }
  })

  it.only('should fetch all secrets when there are some', async () => {
    // Arrange
    // const argv = { service: 'my-service' }
    const argv = { service: 'my-service' }

    // Act
    const envMap = await renderSecretsCommand(argv.service)

    // Assert
    expect(envMap).toStrictEqual({ A: 'B' })
  })

  /*
  it('should fetch 0 secrets when there are none', async () => {
    // Arrange
    // ;(renderSecretsCommand as jest.Mock).mockResolvedValueOnce({
    //   A: 'B',
    // }) // Assuming the function returns an array of secrets
    const argv = { service: 'emptyService' }

    // Act
    const envMap = await renderSecretsCommand(argv.service)

    // Assert
    // expect(renderSecretsCommand).toHaveBeenCalledWith('emptyService')
    // expect(renderSecretsCommand).toReturnWith({})
    expect(envMap).toStrictEqual({ A: 'B' })
  })

  it('should throw an error when the requested service does not exist', async () => {
    // Arrange
    const errorMessage = 'Service not found'
    ;(renderSecretsCommand as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    )
    const argv = { service: 'nonExistentService' }

    // Act & Assert
    await expect(
      yargs
        .command(
          'render-secrets',
          'Render secrets needed by service',
          (yargs) => {
            return yargs.option('service', { demandOption: true })
          },
          async (argv) => {
            await renderSecretsCommand(argv.service)
          },
        )
        .parse(['render-secrets', '--service', argv.service]),
    ).rejects.toThrow(errorMessage)
  })

  it('should correctly fetch the correct number of secrets for a valid service', async () => {
    // Arrange
    const secrets = ['secret1', 'secret2', 'secret3']
    renderSecretsCommand.mockResolvedValueOnce(secrets)
    const argv = { service: 'validService' }

    // Act
    await yargs
      .command(
        'render-secrets',
        'Render secrets needed by service',
        (yargs) => {
          return yargs.option('service', { demandOption: true })
        },
        async (argv) => {
          await renderSecretsCommand(argv.service)
        },
      )
      .parse(['render-secrets', '--service', argv.service])

    // Assert
    expect(renderSecretsCommand).toHaveBeenCalledWith('validService')
    expect(renderSecretsCommand).toReturnWith(secrets)
  })
  */
})
