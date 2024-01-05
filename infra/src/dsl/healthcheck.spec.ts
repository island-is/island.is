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
  type: 'staging',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('Healthchecks definitions', () => {
  describe('Liveness', () => {
    it('defined with path only', async () => {
      const sut = service('api').liveness('/ready').healthPort(5000)
      const result = (await generateOutputOne({
        outputFormat: renderers.helm,
        service: sut,
        runtime: new Kubernetes(Staging),
        env: Staging,
      })) as SerializeSuccess<HelmService>
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
      const result = (await generateOutputOne({
        outputFormat: renderers.helm,
        service: sut,
        runtime: new Kubernetes(Staging),
        env: Staging,
      })) as SerializeSuccess<HelmService>
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
