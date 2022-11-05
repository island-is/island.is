import { ref, service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import {
  SerializeSuccess,
  ServiceHelm,
  HelmValueFile,
} from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './service-dependencies'
import {
  rendererForOne,
  renderHelmValueFile,
} from './output-generators/render-helm-value-file'

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
  let render: HelmValueFile<ServiceHelm>
  beforeEach(async () => {
    serviceDef = (await rendererForOne(
      renderers.helm,
      sut,
      uberChart,
    )) as SerializeSuccess<ServiceHelm>
    render = renderHelmValueFile(uberChart, { a: serviceDef.serviceDef[0] })
  })

  it('missing variables cause errors', () => {
    expect(serviceDef.serviceDef[0].env['A']).toBe('http://mock-visir-is')
  })

  it('should render two services - one extra for the mock', () => {
    expect(render.services['mock-visir-is'].command).toStrictEqual(['mock'])
  })
})
