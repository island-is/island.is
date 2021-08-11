import { service } from './dsl'
import { UberChart } from './uber-chart'
import { serializeService } from './map-to-values'
import { SerializeSuccess } from './types/output-types'
import { EnvironmentConfig } from './types/charts'

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
  domain: 'staging01.devland.is',
  type: 'staging',
  defaultMaxReplicas: 3,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('Basic serialization', () => {
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
      requests: { memory: '1MB', cpu: '100m' },
      limits: { memory: '512MB', cpu: '500m' },
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

  it('basic props', () => {
    expect(result.serviceDef.enabled).toBe(true)
    expect(result.serviceDef.namespace).toBe('islandis')
  })

  it('image and repo', () => {
    expect(result.serviceDef.image.repository).toBe(
      '821090935708.dkr.ecr.eu-west-1.amazonaws.com/test',
    )
  })

  it('command and args', () => {
    expect(result.serviceDef.command).toStrictEqual(['node'])
    expect(result.serviceDef.args).toStrictEqual(['main.js'])
  })
  it('network policies', () => {
    expect(result.serviceDef.grantNamespaces).toStrictEqual([])
    expect(result.serviceDef.grantNamespacesEnabled).toBe(false)
  })

  it('resources', () => {
    expect(result.serviceDef.resources).toStrictEqual({
      requests: {
        cpu: '100m',
        memory: '1MB',
      },
      limits: {
        cpu: '500m',
        memory: '512MB',
      },
    })
  })
  it('replica count', () => {
    expect(result.serviceDef.replicaCount).toStrictEqual({
      min: 1,
      max: 1,
      default: 1,
    })
  })

  it('environment variables', () => {
    expect(result.serviceDef.env).toEqual({
      A: 'B',
      DB_USER: 'api',
      DB_NAME: 'api',
      DB_HOST: 'a',
      NODE_OPTIONS: '--max-old-space-size=464',
      SSF_ON: '',
    })
  })

  it('secretes', () => {
    expect(result.serviceDef.secrets).toEqual({
      SECRET: '/path',
      DB_PASS: '/k8s/api/DB_PASSWORD',
      CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY',
    })
  })

  it('service account', () => {
    expect(result.serviceDef.podSecurityContext).toEqual({
      fsGroup: 65534,
    })
    expect(result.serviceDef.serviceAccount).toEqual({
      annotations: {
        'eks.amazonaws.com/role-arn': 'arn:aws:iam::111111:role/api',
      },
      create: true,
      name: 'api',
    })
  })

  it('ingress', () => {
    expect(result.serviceDef.ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
        },
        hosts: [
          {
            host: 'a.staging01.devland.is',
            paths: ['/api'],
          },
        ],
      },
    })
  })
})

describe('Env definition defaults', () => {
  const sut = service('api').namespace('islandis').image('test')
  const result = serializeService(
    sut,
    new UberChart(Staging),
  ) as SerializeSuccess

  it('replica max count', () => {
    expect(result.serviceDef.replicaCount).toStrictEqual({
      min: 2,
      max: 3,
      default: 2,
    })
  })
})
