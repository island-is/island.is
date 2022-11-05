import { Service } from './types/input-types'
import { HelmOutput } from './output-generators/map-to-helm-values'
import { DeploymentRuntime, EnvironmentConfig } from './types/charts'
import { DockerComposeOutput } from './output-generators/map-to-docker-compose'

const MAX_LEVEL_DEPENDENCIES = 20

export class DependencyTracer implements DeploymentRuntime {
  env: EnvironmentConfig // TODO: get rid of this?
  constructor(env: EnvironmentConfig) {
    this.env = env
  }

  deps: { [name: string]: Set<Service> } = {}

  ref(from: Service, to: Service | string) {
    if (typeof to === 'object') {
      const dependecies = this.deps[to.serviceDef.name] ?? new Set<Service>()
      this.deps[to.serviceDef.name] = dependecies.add(from)
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

const discoverDependencies = async (
  runtime: DeploymentRuntime,
  services: Service[],
) => {
  for (const service of services) {
    await renderers.helm.serializeService(service, runtime, runtime.env.feature)
  }
}

const findDependencies = (
  uberChart: DeploymentRuntime,
  svc: Service,
  svcs: Service[],
  level: number = 0,
): Service[] => {
  const deps = uberChart.deps[svc.serviceDef.name]
  if (level > MAX_LEVEL_DEPENDENCIES)
    throw new Error(
      `Too deep level of dependencies - ${MAX_LEVEL_DEPENDENCIES}. Some kind of circular dependency or you fellas have gone off the deep end ;)`,
    )
  const mocks = Object.entries(uberChart.deps)
    .filter(([s, entry]) => s.startsWith('http'))
    .filter(([s, entry]) => entry.has(svc))
    .map(([s, entry]) => svcs.find((ss) => ss.serviceDef.name === s)!)
  const currentDeps = Array.from(deps ?? new Set<Service>()).concat(
    Array.from(mocks),
  )
  if (currentDeps) {
    const serviceDependencies = currentDeps
    return serviceDependencies
      .map((dependency) =>
        findDependencies(uberChart, dependency, svcs, level + 1),
      )
      .flatMap((x) => x)
      .concat(serviceDependencies)
  } else {
    return []
  }
}

export const getWithDependantServices = async (
  env: EnvironmentConfig,
  habitat: Service[],
  ...services: Service[]
): Promise<Service[]> => {
  const dependencyTracer = new DependencyTracer(env)
  await discoverDependencies(dependencyTracer, habitat) // doing this so we find out the dependencies
  const dependantServices = services
    .map((s) => findDependencies(dependencyTracer, s, habitat))
    .flatMap((x) => x)
  return services
    .concat(dependantServices)
    .reduce(
      (acc: Service[], cur: Service): Service[] =>
        acc.indexOf(cur) === -1 ? acc.concat([cur]) : acc,
      [],
    )
}

// const renderDockerComposeFile = async (
//   uberChart: Kubernetes,
//   ...services: Service[]
// ): Promise<ValueFile<DockerComposeService>> => {
//   const helmServices: Services<DockerComposeService> = await services.reduce(
//     async (acc, s) => {
//       const accVal = await acc
//       const values = await renderers['docker-compose'].serializeService(
//         s,
//         uberChart,
//       )
//       switch (values.type) {
//         case 'error':
//           throw new Error(values.errors.join('\n'))
//         case 'success':
//           // const extras = values.serviceDef.extra
//           // delete values.serviceDef.extra
//           return Promise.resolve({
//             ...accVal,
//             [s.serviceDef.name]: values.serviceDef,
//           })
//       }
//     },
//     Promise.resolve(uberChart.env.global),
//   )
//   const servicesAndMocks = Object.entries(uberChart.deps).reduce(
//     (acc, [name, svcs]) => {
//       if (name.startsWith('mock-')) {
//         return {
//           ...acc,
//           [name]: serviceMockDef({
//             namespace: svcs.values().next().value.serviceDef.namespace,
//             target: name,
//           }),
//         }
//       }
//       return {
//         ...acc,
//       }
//     },
//     helmServices,
//   )
//   return {
//     namespaces: [],
//     services: servicesAndMocks,
//   }
// }
