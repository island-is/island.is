import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import {
  SerializeErrors,
  SerializeSuccess,
  HelmService,
} from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'
import { generateOutputOne } from './processing/rendering-pipeline'

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'staging01.devland.is',
  type: 'staging',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('Postgres', () => {
  describe('identifier fixes', () => {
    const sut = service('service-portal-api').db()
    let result: SerializeSuccess<HelmService>
    beforeEach(async () => {
      result = (await generateOutputOne({
        outputFormat: renderers.helm,
        service: sut,
        runtime: new Kubernetes(Staging),
        env: Staging,
      })) as SerializeSuccess<HelmService>
    })
    it('fixing user and name to comply with postgres identifier allowed character set', () => {
      expect(result.serviceDef[0].env).toEqual({
        DB_USER: 'service_portal_api',
        DB_NAME: 'service_portal_api',
        DB_HOST: 'a',
        DB_REPLICAS_HOST: 'a',
        NODE_OPTIONS:
          '--max-old-space-size=230 --enable-source-maps -r dd-trace/init',
        SERVERSIDE_FEATURES_ON: '',
        LOG_LEVEL: 'info',
      })
    })
  })
  describe('error reporting', () => {
    const sut = service('service-portal-api')
      .db()
      .secrets({ DB_PASS: 'aaa' })
      .env({ DB_USER: 'aaa', DB_HOST: 'a', DB_NAME: '' })
    let result: SerializeErrors
    beforeEach(async () => {
      result = (await generateOutputOne({
        outputFormat: renderers.helm,
        service: sut,
        runtime: new Kubernetes(Staging),
        env: Staging,
      })) as SerializeErrors
    })
    it('Env and secret variables already defined', () => {
      expect(result.errors).toEqual([
        'Collisions in service-portal-api for environment or secrets for key DB_USER',
        'Collisions in service-portal-api for environment or secrets for key DB_NAME',
        'Collisions in service-portal-api for environment or secrets for key DB_HOST',
        'Collisions in service-portal-api for environment or secrets for key DB_PASS',
      ])
    })
  })
  describe('strip postfixes', () => {
    const myService = service('my-service-worker-job').db()
    let result: SerializeSuccess<HelmService>
    beforeEach(async () => {
      result = (await generateOutputOne({
        outputFormat: renderers.helm,
        service: myService,
        runtime: new Kubernetes(Staging),
        env: Staging,
      })) as SerializeSuccess<HelmService>
    })
    it('service name (-worker, -job) postfixes should be stripped', () => {
      expect(result.serviceDef[0]?.env).toMatchObject({
        DB_USER: 'my_service',
      })
    })
  })
})
