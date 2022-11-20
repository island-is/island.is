import { ref, service } from '../dsl'
import { EnvironmentConfig } from '../types/charts'
import { renderer } from '../processing/service-sets'
import { getLocalrunValueFile } from './local-setup'
import { Localhost } from '../localhost-runtime'
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

describe('Local setup', () => {
  const sut = service('api').env({
    A: 'B',
    B: ref((ctx) => `${ctx.svc('https://www.visir.is')}/f/frettir`),
  })
  let serviceDef: Awaited<ReturnType<typeof getLocalrunValueFile>>
  beforeEach(async () => {
    const runtime = new Localhost()
    serviceDef = await getLocalrunValueFile(
      runtime,
      await renderer({
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
    expect(serviceDef.mocks).toStrictEqual({
      'mock-www-visir-is': {
        'proxy-port': 9453,
        'mountebank-imposter-config':
          '{"protocol":"http","name":"mock-www-visir-is","port":9453,"stubs":[{"predicates":[{"equals":{}}],"responses":[{"proxy":{"to":"https://www.visir.is","mode":"proxyAlways","predicateGenerators":[{"matches":{"method":true,"path":true,"query":true,"body":true}}]}}]}]}',
      },
    })
  })
})
