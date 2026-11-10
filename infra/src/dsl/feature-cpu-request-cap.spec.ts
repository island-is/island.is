import { ServiceBuilder, service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import {
  FEATURE_DEPLOYMENT_MAX_CPU_REQUEST_MILLICORES,
  cpuToMillicores,
} from './output-generators/map-to-helm-values'
import { generateOutput } from './processing/rendering-pipeline'
import { EnvironmentConfig } from './types/charts'
import { Resources } from './types/input-types'
import { renderers } from './upstream-dependencies'

const baseEnv: Omit<EnvironmentConfig, 'feature'> = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'dev01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}
const Dev: EnvironmentConfig = { ...baseEnv }
const Feature: EnvironmentConfig = { ...baseEnv, feature: 'feature-A' }

const resources = (requestCpu: string): Resources => ({
  limits: { cpu: '3000m', memory: '2500Mi' },
  requests: { cpu: requestCpu, memory: '2000Mi' },
})

const render = async (svc: ServiceBuilder<any>, env: EnvironmentConfig) => {
  const out = await generateOutput({
    runtime: new Kubernetes(env),
    services: [svc],
    outputFormat: renderers.helm,
    env,
  })
  return out[svc.name()]
}

describe('Feature deployments cap the CPU request', () => {
  it('caps a request above the cap and keeps limits and memory unchanged', async () => {
    const values = await render(
      service('api').resources(resources('900m')),
      Feature,
    )

    expect(values.resources).toEqual({
      limits: { cpu: '3000m', memory: '2500Mi' },
      requests: {
        cpu: `${FEATURE_DEPLOYMENT_MAX_CPU_REQUEST_MILLICORES}m`,
        memory: '2000Mi',
      },
    })
  })

  it('caps whole-core requests ("1")', async () => {
    const values = await render(
      service('web').resources(resources('1')),
      Feature,
    )

    expect(values.resources?.requests.cpu).toEqual('100m')
  })

  it('leaves requests at or below the cap unchanged', async () => {
    const atCap = await render(
      service('at-cap').resources(resources('100m')),
      Feature,
    )
    const below = await render(
      service('below-cap').resources(resources('25m')),
      Feature,
    )

    expect(atCap.resources?.requests.cpu).toEqual('100m')
    expect(below.resources?.requests.cpu).toEqual('25m')
  })

  it('does not change regular (non-feature) dev deployments', async () => {
    const values = await render(
      service('api').resources(resources('900m')),
      Dev,
    )

    expect(values.resources?.requests.cpu).toEqual('900m')
  })

  it('does not mutate a resources object shared between services', async () => {
    const shared = resources('900m')

    await render(service('shared-a').resources(shared), Feature)

    expect(shared.requests.cpu).toEqual('900m')
  })
})

describe('cpuToMillicores', () => {
  it.each([
    ['100m', 100],
    ['1200m', 1200],
    ['1', 1000],
    ['0.5', 500],
    [' 250m ', 250],
  ])('parses %p as %p millicores', (input, expected) => {
    expect(cpuToMillicores(input)).toEqual(expected)
  })

  it('returns undefined for unsupported values', () => {
    expect(cpuToMillicores('abc')).toBeUndefined()
    expect(cpuToMillicores('1Gi')).toBeUndefined()
  })
})
