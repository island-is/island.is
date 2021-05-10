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

describe('Ingress definitions', () => {
  it('Liveness', () => {
    const sut = service('api').liveness('/ready')
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess
    expect(result.serviceDef.healthCheck).toEqual({
      liveness: { path: '/ready' },
      readiness: { path: '/' },
    })
  })
})
