import { ref, service } from '../dsl'
import { EnvironmentConfig } from '../types/charts'
import { generateOutput } from '../processing/rendering-pipeline'
import { getLocalrunValueFile } from './local-setup'
import { Localhost } from '../localhost-runtime'
import {
  LocalrunOutput,
  SecretOptions,
} from '../output-generators/map-to-localrun'
import path from 'path'

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
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

describe('Local setup', () => {
  const sut = service('api').env({
    A: 'B',
    B: ref((ctx) => `${ctx.svc('https://www.visir.is')}/f/frettir`),
    C: '[redis.cluster.1,redis.cluster.2]',
  })
  let serviceDef: Awaited<ReturnType<typeof getLocalrunValueFile>>
  beforeEach(async () => {
    const runtime = new Localhost()
    serviceDef = await getLocalrunValueFile(
      runtime,
      await generateOutput({
        runtime: runtime,
        services: [sut],
        outputFormat: LocalrunOutput({ secrets: SecretOptions.noSecrets }),
        env: Staging,
      }),
    )
  })

  it('Should have services', async () => {
    expect(Object.keys(serviceDef.services)).toStrictEqual(['api'])
  })
  it('Should have mocks', async () => {
    expect(serviceDef.mocks).toStrictEqual(
      `docker run --name mountebank --rm -p 2525:2525 -p 9453:9453 -v ${path.resolve(
        __dirname,
        '..',
        '..',
        '..',
      )}/mountebank-imposter-config.json:/app/default.json:z docker.io/bbyars/mountebank:2.8.1 start --configfile=/app/default.json`,
    )
  })

  it('Should correctly hosts to localhost', async () => {
    const svc = serviceDef.services['api']
    expect(svc.env['A']).toEqual('B')
    expect(svc.env['B']).toEqual('http://localhost:9453/f/frettir')
    expect(svc.env['B']).toMatch(/http:\/\/localhost:\d+\/f\/frettir/)
  })
})
