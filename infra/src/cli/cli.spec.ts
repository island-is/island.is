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
import { SSM } from '@aws-sdk/client-ssm'

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

jest.mock('../dsl/consts', () => ({
  rootDir: '.',
  COMMON_SECRETS: {},
}))

// Mock console.log
jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'error')

jest.mock('@aws-sdk/client-ssm', () => ({
  SSM: jest.fn(() => ({
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
        {
          Name: '/k8s/my-service/JSON_URLS',
          Value: `{ ${[
            '"string": "https://example.com/slug"',
            '"object": {"key": "https://example.com/slug"}',
            '"array": ["https://example.com/slug", "https://example.com/slug"]',
          ].join(', ')}}`,
        },
      ],
    })),
  })),
}))

describe('infra CLI', () => {
  beforeEach(() => {})
  describe('render-secrets command', () => {
    beforeEach(async () => {
      const myServiceSetup = (): ServiceBuilder<'my-service'> =>
        service('my-service').secrets({
          A: '/k8s/my-service/A',
        })

      Charts.islandis = {
        dev: [myServiceSetup()],
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
    beforeEach(async () => {
      const myServiceSetup = () =>
        service('my-service')
          .env({
            REMOTE_URL_ENV: 'https://www.website.tld/some/slug-path',
          })
          .secrets({
            JSON_SECRET: '/k8s/my-service/JSON_SECRET',
            ARRAY_SECRET: '/k8s/my-service/ARRAY_SECRET',
            JSON_URLS: '/k8s/my-service/JSON_URLS',
          })
      const myService = myServiceSetup()
      Charts.islandis = {
        dev: [myService],
        staging: [],
        prod: [],
      }
    })

    it('should map all URIs to localhost', async () => {
      // Arrange
      const argv = {
        services: ['my-service'],
      }

      // Act
      const result = await renderLocalServices(argv)

      // Assert
      expect(result.services['my-service'].env['REMOTE_URL_ENV']).toMatch(
        /http:\/\/localhost(:\d+)?\/some\/slug-path/,
      )
      expect(result).toMatchSnapshot()
    })

    it('should map all secrets to localhost', async () => {
      // Arrange
      const argv = {
        services: ['my-service'],
      }

      // Act
      const result = await renderLocalServices(argv)

      // Assert
      expect(
        JSON.parse(result.services['my-service'].env['JSON_SECRET']),
      ).toStrictEqual({ key: ['value'] })
      // localhost rewrite
      expect(
        JSON.parse(result.services['my-service'].env['JSON_URLS'])?.array,
      ).toStrictEqual([
        'http://localhost:8080/some/slug',
        'http://localhost:8080/some/slug',
      ])
      expect(result).toMatchSnapshot()
    })
  })
})
