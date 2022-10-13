import { ref, service } from './dsl'
import { UberChart } from './uber-chart'
import { serializeService } from './map-to-values'
import { SerializeSuccess } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderValueFile } from './serialize-to-yaml'

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
  feature: 'some-feature',
  global: {},
}

describe('Egress', () => {
  const sut = service('api').env({
    A: ref((h) => `https://${h.svc('visir.is')}`),
  })
  const uberChart = new UberChart(Staging)
  const serviceDef = serializeService(sut, uberChart) as SerializeSuccess
  const render = renderValueFile(uberChart, sut)

  it('missing variables cause errors', () => {
    expect(serviceDef.serviceDef.env['A']).toBe('https://mock-visir.is')
  })

  it('should render two services - one extra for the mock', () => {
    expect(render.services['mock-visir.is'].command).toStrictEqual(['mock'])
  })
})
