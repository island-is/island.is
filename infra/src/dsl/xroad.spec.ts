import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { SerializeSuccess, HelmService } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { XroadConf } from './xroad'
import { renderers } from './upstream-dependencies'
import { generateOutputOne } from './processing/rendering-pipeline'

const Dev: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'staging01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('X-road support', () => {
  const sut = service('service').xroad(
    new XroadConf({
      env: {
        XROAD_VAR1: {
          dev: 'var1a',
          staging: 'var1b',
          prod: 'var1c',
        },
        XROAD_VAR2: 'var2',
      },
      secrets: {
        XROAD_SECRET: '/k8s/secret/much',
      },
    }),
  )
  let svc: SerializeSuccess<HelmService>
  beforeEach(async () => {
    svc = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Dev),
      env: Dev,
    })) as SerializeSuccess<HelmService>
  })

  it('contains all xroad environment variables', () => {
    expect(svc.serviceDef[0].env).toHaveProperty('XROAD_VAR1')
    expect(svc.serviceDef[0].env!.XROAD_VAR1).toEqual('var1a')
    expect(svc.serviceDef[0].env).toHaveProperty('XROAD_VAR2')
    expect(svc.serviceDef[0].env!.XROAD_VAR2).toEqual('var2')
  })

  it('contains all xroad secrets', () => {
    expect(svc.serviceDef[0].secrets).toHaveProperty('XROAD_SECRET')
    expect(svc.serviceDef[0].secrets!.XROAD_SECRET).toEqual('/k8s/secret/much')
  })
})
