import { ref, service } from '../dsl'
import { Localhost } from '../localhost-runtime'
import { renderer } from './service-sets'
import { toServices } from '../exports/to-services'
import { renderers } from '../upstream-dependencies'
import { EnvironmentConfig } from '../types/charts'
import { MissingSetting } from '../types/input-types'
import {
  LocalrunOutput,
  SecretOptions,
} from '../output-generators/map-to-localrun'

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
  global: {},
}

describe.only('ServiceDefinition to Env', () => {
  let uberChart: Localhost
  const currentOutput = LocalrunOutput({ secrets: SecretOptions.noSecrets })
  beforeEach(async () => {
    uberChart = new Localhost(Staging)
  })
  it('should render errors on missing env vars', () => {
    const sut = service('api').env({
      A: 'B',
      B: MissingSetting,
    })
    const serviceDef = renderer(uberChart, toServices([sut]), currentOutput)
    expect(serviceDef).rejects.toThrow(
      'Missing settings for service api in env staging. Keys of missing settings: B',
    )
  })
  it('Should have env variables pointing to localhost', async () => {
    const sut = service('api').env({
      A: 'B',
      B: ref((ctx) => `${ctx.svc('https://www.visir.is')}/f/frettir`),
    })
    const serviceDef = await renderer(
      uberChart,
      toServices([sut]),
      currentOutput,
    )
    expect(serviceDef['api'].env['B']).toBe('http://localhost:9453/f/frettir')
  })
})
