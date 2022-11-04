import { ref, service } from './dsl'
import { Kubernetes } from './kubernetes'
import { serializeService } from './map-to-helm-values'
import { SerializeSuccess, ServiceHelm, ValueFile } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderHelmValueFile } from './process-services'

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
    A: ref((h) => h.svc('http://visir.is')),
  })
  const uberChart = new Kubernetes(Staging)
  let serviceDef: SerializeSuccess<ServiceHelm>
  let render: ValueFile<ServiceHelm>
  beforeEach(async () => {
    serviceDef = (await serializeService(
      sut,
      uberChart,
    )) as SerializeSuccess<ServiceHelm>
    render = await renderHelmValueFile(uberChart, sut)
  })

  it('missing variables cause errors', () => {
    expect(serviceDef.serviceDef[0].env['A']).toBe('http://mock-visir-is')
  })

  it('should render two services - one extra for the mock', () => {
    expect(render.services['mock-visir-is'].command).toStrictEqual(['mock'])
  })
})
