import { ref, service } from '../dsl'
import { Localhost } from '../localhost-runtime'
import { generateOutput } from './rendering-pipeline'
import { EnvironmentConfig } from '../types/charts'
import { MissingSetting } from '../types/input-types'
import {
  LocalrunOutput,
  SecretOptions,
} from '../output-generators/map-to-localrun'

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
  global: {},
}

describe.only('ServiceDefinition to Env', () => {
  let runtime: Localhost
  const currentOutput = LocalrunOutput({ secrets: SecretOptions.noSecrets })
  beforeEach(async () => {
    runtime = new Localhost()
  })
  it('should render errors on missing env vars', () => {
    const sut = service('api').env({
      A: 'B',
      B: MissingSetting,
    })
    const serviceDef = generateOutput({
      runtime: runtime,
      services: [sut],
      outputFormat: currentOutput,
      env: Staging,
    })
    expect(serviceDef).rejects.toThrow(
      'Missing settings for service api in env staging. Keys of missing settings: B',
    )
  })
  it('Should have env variables pointing to localhost', async () => {
    const sut = service('api').env({
      A: 'B',
      B: ref((ctx) => `${ctx.svc('https://www.visir.is')}/f/frettir`),
    })
    const serviceDef = await generateOutput({
      runtime: runtime,
      services: [sut],
      outputFormat: currentOutput,
      env: Staging,
    })
    expect(serviceDef['api'].env['B']).toBe('http://localhost:9453/f/frettir')
  })
})
