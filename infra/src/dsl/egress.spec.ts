import { ref, service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import {
  HelmValueFile,
  SerializeSuccess,
  HelmService,
} from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'
import { getHelmValueFile } from './value-files-generators/helm-value-file'
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
  feature: 'some-feature',
  global: {},
}

describe('Egress', () => {
  const sut = service('api').env({
    A: ref((h) => h.svc('http://visir.is')),
  })
  const runtime = new Kubernetes(Staging, 'with-mocks')
  let serviceDef: SerializeSuccess<HelmService>
  let render: HelmValueFile
  beforeEach(async () => {
    serviceDef = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: runtime,
      env: Staging,
    })) as SerializeSuccess<HelmService>
    render = getHelmValueFile(
      runtime,
      { a: serviceDef.serviceDef[0] },
      'with-mocks',
      Staging,
    )
  })

  it('Variable has address of the mock', () => {
    expect(serviceDef.serviceDef[0].env['A']).toBe(
      'http://web-mock-server:9209',
    )
  })

  it('should render an extra for the mock', () => {
    expect(render.services['mock-server'].command?.[0]).toMatch('mb')
  })
})
