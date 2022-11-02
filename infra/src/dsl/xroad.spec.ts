import { ref, service, ServiceBuilder } from './dsl'
import { Kubernetes } from './kubernetes'
import { serializeService } from './map-to-helm-values'
import { SerializeSuccess } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { XroadConf } from './xroad'

const Dev: EnvironmentConfig = {
  auroraHost: 'a',
  domain: 'staging01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  feature: 'feature-A',
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
  const svc = serializeService(sut, new Kubernetes(Dev)) as SerializeSuccess

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
