import { service, ServiceBuilder } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { SerializeSuccess, HelmService } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'
import { generateOutputOne } from './processing/rendering-pipeline'

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

const render = async (sut: ServiceBuilder<'api'>) => {
  const result = (await generateOutputOne({
    outputFormat: renderers.helm,
    service: sut,
    runtime: new Kubernetes(Staging),
    env: Staging,
  })) as SerializeSuccess<HelmService>
  return result.serviceDef[0]
}

describe('Rollout strategy definitions', () => {
  it('does not set a strategy by default (chart default applies)', async () => {
    const sut: ServiceBuilder<'api'> = service('api')
    const serviceDef = await render(sut)
    expect(serviceDef.strategy).toBeUndefined()
  })

  it('maps a zero-downtime rollout strategy', async () => {
    const sut: ServiceBuilder<'api'> = service('api').strategy({
      type: 'RollingUpdate',
      rollingUpdate: { maxSurge: '25%', maxUnavailable: 0 },
    })
    const serviceDef = await render(sut)
    expect(serviceDef.strategy).toEqual({
      type: 'RollingUpdate',
      rollingUpdate: { maxSurge: '25%', maxUnavailable: 0 },
    })
  })

  it('resolves a per-env strategy to the environment value (staging)', async () => {
    const sut: ServiceBuilder<'api'> = service('api').strategy({
      dev: {
        type: 'RollingUpdate',
        rollingUpdate: { maxSurge: '25%', maxUnavailable: '25%' },
      },
      staging: {
        type: 'RollingUpdate',
        rollingUpdate: { maxSurge: '25%', maxUnavailable: 0 },
      },
      prod: {
        type: 'RollingUpdate',
        rollingUpdate: { maxSurge: '25%', maxUnavailable: 0 },
      },
    })
    // render() uses the Staging env
    const serviceDef = await render(sut)
    expect(serviceDef.strategy).toEqual({
      type: 'RollingUpdate',
      rollingUpdate: { maxSurge: '25%', maxUnavailable: 0 },
    })
  })
})

describe('Graceful shutdown definitions', () => {
  it('does not set graceful shutdown fields by default', async () => {
    const sut: ServiceBuilder<'api'> = service('api')
    const serviceDef = await render(sut)
    expect(serviceDef.minReadySeconds).toBeUndefined()
    expect(serviceDef.terminationGracePeriodSeconds).toBeUndefined()
    expect(serviceDef.lifecycle).toBeUndefined()
  })

  it('maps minReadySeconds and terminationGracePeriodSeconds', async () => {
    const sut: ServiceBuilder<'api'> = service('api').gracefulShutdown({
      minReadySeconds: 10,
      terminationGracePeriodSeconds: 60,
    })
    const serviceDef = await render(sut)
    expect(serviceDef.minReadySeconds).toEqual(10)
    expect(serviceDef.terminationGracePeriodSeconds).toEqual(60)
    expect(serviceDef.lifecycle).toBeUndefined()
  })

  it('maps preStopSleepSeconds to a preStop exec sleep hook', async () => {
    const sut: ServiceBuilder<'api'> = service('api').gracefulShutdown({
      preStopSleepSeconds: 10,
    })
    const serviceDef = await render(sut)
    expect(serviceDef.lifecycle).toEqual({
      preStop: { exec: { command: ['/bin/sh', '-c', 'sleep 10'] } },
    })
  })

  it('resolves per-env graceful shutdown to the environment value (staging)', async () => {
    const sut: ServiceBuilder<'api'> = service('api').gracefulShutdown({
      dev: { minReadySeconds: 0, terminationGracePeriodSeconds: 30 },
      staging: {
        minReadySeconds: 10,
        terminationGracePeriodSeconds: 60,
        preStopSleepSeconds: 10,
      },
      prod: {
        minReadySeconds: 10,
        terminationGracePeriodSeconds: 60,
        preStopSleepSeconds: 10,
      },
    })
    // render() uses the Staging env
    const serviceDef = await render(sut)
    expect(serviceDef.minReadySeconds).toEqual(10)
    expect(serviceDef.terminationGracePeriodSeconds).toEqual(60)
    expect(serviceDef.lifecycle).toEqual({
      preStop: { exec: { command: ['/bin/sh', '-c', 'sleep 10'] } },
    })
  })
})
