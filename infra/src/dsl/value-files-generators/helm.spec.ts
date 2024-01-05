import { ref, service } from '../dsl'
import { EnvironmentConfig } from '../types/charts'
import { renderHelmServiceFile } from '../exports/helm'

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
  feature: 'dsfd',
  global: {},
}

describe('Local setup', () => {
  const sut = service('api').env({
    A: 'B',
    B: ref((ctx) => `${ctx.svc('https://www.visir.is')}/f/frettir`),
  })
  let serviceDef: Awaited<ReturnType<typeof renderHelmServiceFile>>
  beforeEach(async () => {
    serviceDef = await renderHelmServiceFile(
      Staging,
      [sut],
      [sut],
      'with-mocks',
    )
  })

  it('Should have services', () => {
    expect(Object.keys(serviceDef.services)).toStrictEqual([
      'api',
      'mock-server',
    ])
  })
  it('Should have replicas', () => {
    expect(serviceDef.services['mock-server'].replicaCount).toStrictEqual({
      default: 1,
      max: 1,
      min: 1,
    })
  })
})
