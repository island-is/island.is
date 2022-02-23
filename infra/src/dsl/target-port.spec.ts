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

describe('Basic serialization', () => {
  it('service account', () => {
    const sut = service('api').targetPort(4200)
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess
    expect(result.serviceDef.service).toEqual({
      targetPort: 4200,
    })
  })
})
