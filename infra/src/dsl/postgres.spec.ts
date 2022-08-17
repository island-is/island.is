import { service } from './dsl'
import { UberChart } from './uber-chart'
import { serializeService } from './map-to-values'
import { SerializeErrors, SerializeSuccess } from './types/output-types'
import { EnvironmentConfig } from './types/charts'

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
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
    const sut = service('service-portal-api').postgres()
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess

    it('fixing user and name to comply with postgres identifier allowed character set', () => {
      expect(result.serviceDef.env).toEqual({
        DB_USER: 'service_portal_api',
        DB_NAME: 'service_portal_api',
        DB_HOST: 'a',
        DB_REPLICAS_HOST: 'a',
        NODE_OPTIONS: '--max-old-space-size=208',
        SERVERSIDE_FEATURES_ON: '',
      })
    })
  })
  describe('error reporting', () => {
    const sut = service('service-portal-api')
      .postgres()
      .secrets({ DB_PASS: 'aaa' })
      .env({ DB_USER: 'aaa', DB_HOST: 'a', DB_NAME: '' })
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeErrors

    it('Env and secret variables already defined', () => {
      expect(result.errors).toEqual([
        'Collisions in service-portal-api for environment or secrets for key DB_USER',
        'Collisions in service-portal-api for environment or secrets for key DB_NAME',
        'Collisions in service-portal-api for environment or secrets for key DB_HOST',
        'Collisions in service-portal-api for environment or secrets for key DB_PASS',
      ])
    })
  })
})
