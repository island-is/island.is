import {
  ServiceDefinition,
  ServiceDefinitionCore,
  ServiceDefinitionForEnv,
} from './types/input-types'
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
import { logger } from '../common'

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

const broken: (name: string) => OutputFormat<ServiceOutputType> = (name) => ({
  featureDeployment(..._args: any): void {
    throw new Error(`Broken featureDeployment (name=${name})`)
  },
  serializeService(..._args: any) {
    throw new Error(`Broken serializeService (name=${name})`)
  },
  serviceMockDef(..._args: any) {
    throw new Error(`Broken serviceMockDef (name=${name})`)
  },
})
export const renderers: { [name: string]: OutputFormat<ServiceOutputType> } = {
  broken: broken('broken'),
  // helm: broken('helm'),
  localrun: broken('localrun'),
  // localrunNoSecrets: broken('localrunNoSecrets'),
  helm: HelmOutput,
  // localrun: LocalrunOutput({ secrets: SecretOptions.withSecrets }),
  localrunNoSecrets: LocalrunOutput({ secrets: SecretOptions.noSecrets }),
} as const

const findUpstreamDependencies = (
  runtime: UpstreamDependencyTracer,
  svc: ServiceBuilder<any> | string,
  { dryRun = false, level = 0, noUpdateSecrets = false } = {},
): string[] => {
  logger.debug('findUpstreamDependencies', {
    svc,
    options: { dryRun, level, noUpdateSecrets },
  })
  if (level > MAX_LEVEL_DEPENDENCIES)
    throw new Error(
      `Too deep level of dependencies - ${MAX_LEVEL_DEPENDENCIES}. Some kind of circular dependency or you fellas have gone off the deep end ;)`,
    )
  const upstreams = Array.from(
    runtime.deps[typeof svc === 'string' ? svc : svc.serviceDef.name] ??
      new Set<string>(),
  )
  logger.debug('Recursively finding upstream dependencies', { upstreams })
  return upstreams
    .map((dependency) =>
      findUpstreamDependencies(runtime, dependency, {
        level: level + 1,
      }),
    )
    .flatMap((x) => x)
    .concat(upstreams)
}

export const withUpstreamDependencies = async <T extends ServiceOutputType>(
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  serializer: OutputFormat<T>,
  { dryRun = false, noUpdateSecrets = false } = {},
): Promise<ServiceBuilder<any>[]> => {
  logger.debug('withUpstreamDependencies', {
    services,
    options: { dryRun, noUpdateSecrets },
  })
  const dependencyTracer = new UpstreamDependencyTracer()
  const localHabitat = cloneDeep(habitat)

  logger.debug(`Generating output for ${localHabitat.length} services`)
  await generateOutput({
    runtime: dependencyTracer,
    services: localHabitat,
    outputFormat: serializer,
    env: env,
  }) // doing this so we find out the dependencies

  logger.debug('Finding downstream dependencies')
  const downstreamServices = services
    .map((s) =>
      findUpstreamDependencies(dependencyTracer, s, {
        dryRun,
        noUpdateSecrets,
      }),
    )
    .flatMap((x) => x)

  logger.debug('Doing some hacks')
  const hacks = services
    .map((s) => s.serviceDef.name)
    .concat(downstreamServices)
    .includes('application-system-api')
    ? findUpstreamDependencies(dependencyTracer, 'api', {
        dryRun,
        noUpdateSecrets,
      }).concat(['api'])
    : []

  logger.debug('Rebuilding the output')
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
