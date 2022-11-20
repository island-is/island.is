import { ServiceDefinition, ServiceDefinitionCore } from './types/input-types'
import { DeploymentRuntime, EnvironmentConfig } from './types/charts'
import cloneDeep from 'lodash/cloneDeep'
import { renderer } from './processing/service-sets'
import { renderers } from './upstream-dependencies'
import { ServiceBuilder } from './dsl'

const MAX_LEVEL_DEPENDENCIES = 20

class DownstreamDependencyTracer implements DeploymentRuntime {
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

const findDownstreamDependencies = (
  runtime: DownstreamDependencyTracer,
  svc: ServiceDefinition | string,
  level: number = 0,
): string[] => {
  const deps = runtime.deps[typeof svc === 'string' ? svc : svc.name]
  if (level > MAX_LEVEL_DEPENDENCIES)
    throw new Error(
      `Too deep level of dependencies - ${MAX_LEVEL_DEPENDENCIES}. Some kind of circular dependency or you fellas have gone off the deep end ;)`,
    )
  const currentDeps = Array.from(deps ?? new Set<string>())
  if (currentDeps) {
    const serviceDependencies = currentDeps
    return serviceDependencies
      .map((dependency) =>
        findDownstreamDependencies(runtime, dependency, level + 1),
      )
      .flatMap((x) => x)
      .concat(serviceDependencies)
  } else {
    return []
  }
}

export const getWithDownstreamServices = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
): Promise<ServiceBuilder<any>[]> => {
  const dependencyTracer = new DownstreamDependencyTracer()
  const localHabitat = cloneDeep(habitat)
  await renderer({
    runtime: dependencyTracer,
    services: localHabitat,
    outputFormat: renderers.helm,
    env: env,
  }) // doing this so we find out the dependencies
  const downstreamServices = services
    .map((s) => findDownstreamDependencies(dependencyTracer, s.serviceDef))
    .flatMap((x) => x)
  return services
    .concat(
      downstreamServices.map(
        (dep) => habitat.find((s) => s.serviceDef.name === dep)!,
      ),
    )
    .reduce(
      (
        acc: ServiceBuilder<any>[],
        cur: ServiceBuilder<any>,
      ): ServiceBuilder<any>[] =>
        acc.indexOf(cur) === -1 ? acc.concat([cur]) : acc,
      [],
    )
}
