import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { SerializeSuccess, ServiceHelm } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './service-dependencies'

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

describe('Healthchecks definitions', () => {
  describe('Liveness', () => {
    it('defined with path only', async () => {
      const sut = service('api').liveness('/ready').healthPort(5000)
      const result = (await renderers.helm.serializeService(
        sut,
        new Kubernetes(Staging),
      )) as SerializeSuccess<ServiceHelm>
      expect(result.serviceDef[0].healthCheck).toEqual({
        liveness: {
          path: '/ready',
          initialDelaySeconds: 3,
          timeoutSeconds: 3,
        },
        port: 5000,
        readiness: { path: '/', initialDelaySeconds: 3, timeoutSeconds: 3 },
      })
    })
    it('defined with object', async () => {
      const sut = service('api').liveness({
        path: '/ready',
        initialDelaySeconds: 10,
      })
      const result = (await renderers.helm.serializeService(
        sut,
        new Kubernetes(Staging),
      )) as SerializeSuccess<ServiceHelm>
      expect(result.serviceDef[0].healthCheck).toEqual({
        liveness: {
          path: '/ready',
          initialDelaySeconds: 10,
          timeoutSeconds: 3,
        },
        readiness: { path: '/', initialDelaySeconds: 3, timeoutSeconds: 3 },
      })
    })
  })
})
