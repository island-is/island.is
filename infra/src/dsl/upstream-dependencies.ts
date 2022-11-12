import { ServiceDefinition, ServiceDefinitionCore } from './types/input-types'
import { HelmOutput } from './output-generators/map-to-helm-values'
import { DeploymentRuntime, EnvironmentConfig } from './types/charts'
import { LocalrunOutput } from './output-generators/map-to-localrun'
import cloneDeep from 'lodash/cloneDeep'
import { renderer } from './processing/service-sets'

const MAX_LEVEL_DEPENDENCIES = 20

class UpstreamDependencyTracer implements DeploymentRuntime {
  env: EnvironmentConfig // TODO: get rid of this?
  constructor(env: EnvironmentConfig) {
    this.env = env
  }

  deps: { [name: string]: Set<string> } = {}

  ref(from: ServiceDefinitionCore, to: ServiceDefinition | string) {
    const dependecies = this.deps[from.name] ?? new Set<string>()
    if (typeof to === 'object') {
      dependecies.add(typeof to === 'object' ? to.name : to)
      this.deps[from.name] = dependecies
      return 'tracer'
    } else {
      return to
    }
  }
}

export const renderers = {
  helm: HelmOutput,
  'docker-compose': LocalrunOutput,
}

const findUpstreamDependencies = (
  uberChart: UpstreamDependencyTracer,
  svc: ServiceDefinition | string,
  level: number = 0,
): string[] => {
  if (level > MAX_LEVEL_DEPENDENCIES)
    throw new Error(
      `Too deep level of dependencies - ${MAX_LEVEL_DEPENDENCIES}. Some kind of circular dependency or you fellas have gone off the deep end ;)`,
    )
  const upstreams = Array.from(
    uberChart.deps[typeof svc === 'string' ? svc : svc.name] ??
      new Set<string>(),
  )
  return upstreams
    .map((dependency) =>
      findUpstreamDependencies(uberChart, dependency, level + 1),
    )
    .flatMap((x) => x)
    .concat(upstreams)
}

export const withUpstreamDependencies = async (
  env: EnvironmentConfig,
  habitat: ServiceDefinition[],
  services: ServiceDefinition[],
): Promise<ServiceDefinition[]> => {
  const dummyEnv: EnvironmentConfig = {
    auroraHost: '',
    awsAccountId: '',
    awsAccountRegion: 'eu-west-1',
    defaultMaxReplicas: 0,
    defaultMinReplicas: 0,
    domain: '',
    featuresOn: [],
    global: {},
    releaseName: '',
    feature: env.feature,
    type: 'dev',
  }
  const dependencyTracer = new UpstreamDependencyTracer(dummyEnv)
  const localHabitat = cloneDeep(habitat)
  await renderer(dependencyTracer, localHabitat, renderers['docker-compose']) // doing this so we find out the dependencies
  const downstreamServices = services
    .map((s) => findUpstreamDependencies(dependencyTracer, s))
    .flatMap((x) => x)

  const hacks = services
    .map((s) => s.name)
    .concat(downstreamServices)
    .includes('application-system-api')
    ? findUpstreamDependencies(dependencyTracer, 'api').concat(['api'])
    : []

  return services
    .concat(
      downstreamServices
        .concat(hacks)
        .map((dep) => habitat.find((s) => s.name === dep)!),
    )
    .reduce(
      (acc: ServiceDefinition[], cur: ServiceDefinition): ServiceDefinition[] =>
        acc.indexOf(cur) === -1 ? acc.concat([cur]) : acc,
      [],
    )
}
