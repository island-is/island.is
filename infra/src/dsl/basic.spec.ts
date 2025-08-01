import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { SerializeSuccess, HelmService } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'
import { generateOutputOne } from './processing/rendering-pipeline'

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'staging01.devland.is',
  type: 'prod',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
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
    .args('main.cjs')
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
    .db()
  let result: SerializeSuccess<HelmService>
  beforeEach(async () => {
    result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
  })

  it('basic props', () => {
    expect(result.serviceDef[0].enabled).toBe(true)
    expect(result.serviceDef[0].namespace).toBe('islandis')
  })

  it('image and repo', () => {
    expect(result.serviceDef[0].image.repository).toBe(
      '821090935708.dkr.ecr.eu-west-1.amazonaws.com/test',
    )
  })

  it('command and args', () => {
    expect(result.serviceDef[0].command).toStrictEqual(['node'])
    expect(result.serviceDef[0].args).toStrictEqual(['main.cjs'])
  })
  it('network policies', () => {
    expect(result.serviceDef[0].grantNamespaces).toStrictEqual([])
    expect(result.serviceDef[0].grantNamespacesEnabled).toBe(false)
  })

  it('resources', () => {
    expect(result.serviceDef[0].resources).toStrictEqual({
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
    expect(result.serviceDef[0].replicaCount).toStrictEqual({
      min: 1,
      max: 1,
      default: 1,
    })
  })

  it('environment variables', () => {
    expect(result.serviceDef[0].env).toEqual({
      A: 'B',
      DB_USER: 'api',
      DB_NAME: 'api',
      DB_HOST: 'a',
      DB_REPLICAS_HOST: 'a',
      NODE_OPTIONS:
        '--max-old-space-size=460 --enable-source-maps -r dd-trace/init',
      SERVERSIDE_FEATURES_ON: '',
      LOG_LEVEL: 'info',
    })
  })

  it('secrets', () => {
    expect(result.serviceDef[0].secrets).toEqual({
      SECRET: '/path',
      DB_PASS: '/k8s/api/DB_PASSWORD',
      CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY',
    })
  })

  it('service account', () => {
    expect(result.serviceDef[0].podSecurityContext).toEqual({
      fsGroup: 65534,
    })
    expect(result.serviceDef[0].serviceAccount).toEqual({
      annotations: {
        'eks.amazonaws.com/role-arn': 'arn:aws:iam::111111:role/api',
      },
      create: true,
      name: 'api',
    })
  })

  it('ingress', () => {
    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
          'nginx.ingress.kubernetes.io/service-upstream': 'true',
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
  let result: SerializeSuccess<HelmService>
  beforeEach(async () => {
    result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
  })
  it('replica max count', () => {
    expect(result.serviceDef[0].replicaCount).toStrictEqual({
      min: 2,
      max: 3,
      default: 2,
    })
  })
})
