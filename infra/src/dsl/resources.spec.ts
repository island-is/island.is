import { service } from './dsl'
import { UberChart } from './uber-chart'
import { serializeService } from './map-to-values'
import { SerializeSuccess } from './types/output-types'
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

describe('Serialization with env resources set', () => {
  const sut = service('api')
    .namespace('islandis')
    .image('test')
    .env({ A: 'B' })
    .secrets({
      SECRET: '/path',
    })
    .serviceAccount()
    .command('node')
    .args('main.js')
    .resources({
      dev: {
        requests: { memory: '1MB', cpu: '100m' },
        limits: { memory: '512MB', cpu: '500m' },
      },
      staging: {
        requests: { memory: '11MB', cpu: '200m' },
        limits: { memory: '1000MB', cpu: '500m' },
      },
      prod: {
        requests: { memory: '22MB', cpu: '400m' },
        limits: { memory: '2000MB', cpu: '1000m' },
      },
    })
    .replicaCount({
      min: 1,
      max: 1,
      default: 1,
    })
    .ingress({
      primary: {
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api'],
      },
    })
    .postgres()
  const result = serializeService(
    sut,
    new UberChart(Staging),
  ) as SerializeSuccess
  it('resource requests', () => {
    expect(result.serviceDef.resources?.requests.cpu).toBe('200m')
    expect(result.serviceDef.resources?.requests.memory).toBe('11MB')
  })

  it('resource limits', () => {
    expect(result.serviceDef.resources?.limits?.cpu).toBe('500m')
    expect(result.serviceDef.resources?.limits?.memory).toBe('1000MB')
  })
  it('resources', () => {
    expect(result.serviceDef.resources).toStrictEqual({
      requests: {
        cpu: '200m',
        memory: '11MB',
      },
      limits: {
        cpu: '500m',
        memory: '1000MB',
      },
    })
  })
})
