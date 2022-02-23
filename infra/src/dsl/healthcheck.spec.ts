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
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('Healthchecks definitions', () => {
  describe('Liveness', () => {
    it('defined with path only', () => {
      const sut = service('api').liveness('/ready')
      const result = serializeService(
        sut,
        new UberChart(Staging),
      ) as SerializeSuccess
      expect(result.serviceDef.healthCheck).toEqual({
        liveness: {
          path: '/ready',
          initialDelaySeconds: 3,
          timeoutSeconds: 3,
        },
        readiness: { path: '/', initialDelaySeconds: 3, timeoutSeconds: 3 },
      })
    })
    it('defined with object', () => {
      const sut = service('api').liveness({
        path: '/ready',
        initialDelaySeconds: 10,
      })
      const result = serializeService(
        sut,
        new UberChart(Staging),
      ) as SerializeSuccess
      expect(result.serviceDef.healthCheck).toEqual({
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
