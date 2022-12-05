import { ServiceDefinition, ServiceDefinitionCore } from './types/input-types'
import { HelmOutput } from './output-generators/map-to-helm-values'
import { ReferenceResolver, EnvironmentConfig } from './types/charts'
import {
  LocalrunOutput,
  SecretOptions,
} from './output-generators/map-to-localrun'
import cloneDeep from 'lodash/cloneDeep'
import { generateOutput } from './processing/rendering-pipeline'
import { OutputFormat, ServiceOutputType } from './types/output-types'
import { ServiceBuilder } from './dsl'

const MAX_LEVEL_DEPENDENCIES = 20

class UpstreamDependencyTracer implements ReferenceResolver {
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
  localrun: LocalrunOutput({ secrets: SecretOptions.withSecrets }),
}

const findUpstreamDependencies = (
  runtime: UpstreamDependencyTracer,
  svc: ServiceBuilder<any> | string,
  level: number = 0,
): string[] => {
  if (level > MAX_LEVEL_DEPENDENCIES)
    throw new Error(
      `Too deep level of dependencies - ${MAX_LEVEL_DEPENDENCIES}. Some kind of circular dependency or you fellas have gone off the deep end ;)`,
    )
  const upstreams = Array.from(
    runtime.deps[typeof svc === 'string' ? svc : svc.serviceDef.name] ??
      new Set<string>(),
  )
  return upstreams
    .map((dependency) =>
      findUpstreamDependencies(runtime, dependency, level + 1),
    )
    .flatMap((x) => x)
    .concat(upstreams)
}

export const withUpstreamDependencies = async <T extends ServiceOutputType>(
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  serializer: OutputFormat<T>,
): Promise<ServiceBuilder<any>[]> => {
  const dependencyTracer = new UpstreamDependencyTracer()
  const localHabitat = cloneDeep(habitat)
  await generateOutput({
    runtime: dependencyTracer,
    services: localHabitat,
    outputFormat: serializer,
    env: env,
  }) // doing this so we find out the dependencies
  const downstreamServices = services
    .map((s) => findUpstreamDependencies(dependencyTracer, s))
    .flatMap((x) => x)

  const hacks = services
    .map((s) => s.serviceDef.name)
    .concat(downstreamServices)
    .includes('application-system-api')
    ? findUpstreamDependencies(dependencyTracer, 'api').concat(['api'])
    : []

  return services
    .concat(
      downstreamServices
        .concat(hacks)
        .map((dep) => habitat.find((s) => s.serviceDef.name === dep)!),
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
