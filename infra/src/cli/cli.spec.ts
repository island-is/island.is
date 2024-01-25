import { renderSecretsCommand } from './render-secrets'
import { Charts } from '../uber-charts/all-charts'

import { ref, service, ServiceBuilder } from '../dsl/dsl'
import { EnvironmentConfig } from '../dsl/types/charts'
import { generateOutput } from '../dsl/processing/rendering-pipeline'
import { getLocalrunValueFile } from '../dsl/value-files-generators/local-setup'
import { Localhost } from '../dsl/localhost-runtime'
import {
  LocalrunOutput,
  SecretOptions,
} from '../dsl/output-generators/map-to-localrun'
import { renderLocalServices } from './render-local-mocks'

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

// Mock console.log
jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'error')

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

describe('infra CLI', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
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

    it('should fetch all secrets when there are some', async () => {
      // Arrange
      const argv = { service: 'my-service' }

      // Act
      const secretsMap = await renderSecretsCommand(argv.service)

      // Assert
      expect(secretsMap).toStrictEqual({ A: 'B' })
    })

    it('should fetch 0 secrets when there are none', async () => {
      // Arrange
      const argv = { service: 'emptyService' }

      // Act
      const secretsMap = await renderSecretsCommand(argv.service)

      // Assert
      expect(secretsMap).toStrictEqual({})
    })
  })

  describe('render-local-env', () => {
    let myService: ServiceBuilder<'my-service'>
    beforeEach(async () => {
      const myServiceSetup = () =>
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
      myService = myServiceSetup()
    })

    it('should map all URIs to localhost', async () => {
      // Arrange
      const argv = {
        services: ['my-service'],
        json: true,
        'no-update-secrets': true,
      }

      // Act
      const result = await renderLocalServices(argv)

      // Assert
      expect(result).toMatchSnapshot()
    })
  })
})
