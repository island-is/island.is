import { ServiceDefinition, ServiceDefinitionCore } from './types/input-types'
import { HelmOutput } from './output-generators/map-to-helm-values'
import { DeploymentRuntime, EnvironmentConfig } from './types/charts'
import { DockerComposeOutput } from './output-generators/map-to-docker-compose'
import cloneDeep from 'lodash/cloneDeep'
import { renderer } from './processing/service-sets'

const MAX_LEVEL_DEPENDENCIES = 20

class DependencyTracer implements DeploymentRuntime {
  env: EnvironmentConfig // TODO: get rid of this?
  constructor(env: EnvironmentConfig) {
    this.env = env
  }

  deps: { [name: string]: Set<string> } = {}

  ref(from: ServiceDefinitionCore, to: ServiceDefinition | string) {
    if (typeof to === 'object') {
      const dependecies = this.deps[to.name] ?? new Set<string>()
      this.deps[to.name] = dependecies.add(from.name)
      return 'tracer'
    } else {
      return to
    }
  }
}

export const renderers = {
  helm: HelmOutput,
  'docker-compose': DockerComposeOutput,
}

const findDependencies = (
  uberChart: DeploymentRuntime,
  svc: ServiceDefinition | string,
  habitat: ServiceDefinition[],
  level: number = 0,
): string[] => {
  const deps = uberChart.deps[typeof svc === 'string' ? svc : svc.name]
  if (level > MAX_LEVEL_DEPENDENCIES)
    throw new Error(
      `Too deep level of dependencies - ${MAX_LEVEL_DEPENDENCIES}. Some kind of circular dependency or you fellas have gone off the deep end ;)`,
    )
  // const mocks = Object.entries(uberChart.deps)
  //   .filter(([s, entry]) => s.startsWith('http'))
  //   .filter(([s, entry]) => entry.has(svc))
  //   .map(([s, entry]) => svcs.find((ss) => ss.serviceDef.name === s)!)
  const currentDeps = Array.from(deps ?? new Set<string>())
  // .concat(Array.from(mocks))
  if (currentDeps) {
    const serviceDependencies = currentDeps
    return serviceDependencies
      .map((dependency) =>
        findDependencies(uberChart, dependency, habitat, level + 1),
      )
      .flatMap((x) => x)
      .concat(serviceDependencies)
  } else {
    return []
  }
}

export const getWithDependantServices = async (
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
  const dependencyTracer = new DependencyTracer(dummyEnv)
  const localHabitat = cloneDeep(habitat)
  await renderer(dependencyTracer, localHabitat, renderers.helm) // doing this so we find out the dependencies
  const dependantServices = services
    .map((s) => findDependencies(dependencyTracer, s, localHabitat))
    .flatMap((x) => x)
  return services
    .concat(
      dependantServices.map((dep) => habitat.find((s) => s.name === dep)!),
    )
    .reduce(
      (acc: ServiceDefinition[], cur: ServiceDefinition): ServiceDefinition[] =>
        acc.indexOf(cur) === -1 ? acc.concat([cur]) : acc,
      [],
    )
}
