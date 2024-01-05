import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { SerializeSuccess, HelmService } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'
import { generateOutputOne } from './processing/rendering-pipeline'

const Dev: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'redis-applications.internal:6379',
  domain: 'dev01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}
describe('Redis', () => {
  describe('Default redis setting', () => {
    const sut = service('services-sessions').redis()
    let result: SerializeSuccess<HelmService>
    beforeEach(async () => {
      result = (await generateOutputOne({
        outputFormat: renderers.helm,
        service: sut,
        runtime: new Kubernetes(Dev),
        env: Dev,
      })) as SerializeSuccess<HelmService>
    })
    it('REDIS_URL_NODE_01 is set', () => {
      expect(result.serviceDef[0].env).toEqual(
        expect.objectContaining({
          REDIS_URL_NODE_01: 'redis-applications.internal:6379',
        }),
      )
    })
  })
  describe('Explicit redis setting', () => {
    const sut = service('services-sessions').redis({
      host: {
        dev: 'dev.endpoint.redis.test',
        staging: 'staging.endpoint.redis.test',
        prod: 'prod.endpoint.redis.test',
      },
    })
    let result: SerializeSuccess<HelmService>
    beforeEach(async () => {
      result = (await generateOutputOne({
        outputFormat: renderers.helm,
        service: sut,
        runtime: new Kubernetes(Dev),
        env: Dev,
      })) as SerializeSuccess<HelmService>
    })
    it('REDIS_URL_NODE_01', () => {
      expect(result.serviceDef[0].env).toEqual(
        expect.objectContaining({
          REDIS_URL_NODE_01: 'dev.endpoint.redis.test',
        }),
      )
    })
  })
})
