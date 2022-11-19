import { ref, service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import {
  HelmValueFile,
  SerializeSuccess,
  ServiceHelm,
} from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'
import { helmValueFile } from './value-files-generators/render-helm-value-file'
import { rendererForOne } from './processing/service-sets'

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
  const runtime = new Kubernetes(Staging)
  let serviceDef: SerializeSuccess<ServiceHelm>
  let render: HelmValueFile
  beforeEach(async () => {
    serviceDef = (await rendererForOne(
      renderers.helm,
      sut.serviceDef,
      runtime,
      Staging,
    )) as SerializeSuccess<ServiceHelm>
    render = helmValueFile(
      runtime,
      { a: serviceDef.serviceDef[0] },
      'with-mocks',
      Staging,
    )
  })

  it('missing variables cause errors', () => {
    expect(serviceDef.serviceDef[0].env['A']).toBe(
      'http://web-mock-server:9209',
    )
  })

  it('should render two services - one extra for the mock', () => {
    expect(render.services['mock-server'].command?.[0]).toMatch('mb')
  })
})
