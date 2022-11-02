// import {
//   postgresIdentifier,
//   serializeService,
//   serviceMockDef,
// } from './map-to-values'
import {
  DockerComposeOutput,
  serializeService,
  serviceMockDef,
} from './map-to-docker-compose'
import { Service } from './types/input-types'
import { UberChart } from './uber-chart'
import {
  DockerComposeService,
  ServiceHelm,
  Services,
  ValueFile,
} from './types/output-types'
import { HelmOutput } from './map-to-helm-values'

const MAX_LEVEL_DEPENDENCIES = 20

const renderers = {
  helm: HelmOutput,
  'docker-compose': DockerComposeOutput,
}

export const renderHelmValueFile = (
  uberChart: UberChart,
  ...services: Service[]
): ValueFile<ServiceHelm> => {
  const helmServices: Services<ServiceHelm> = services.reduce((acc, s) => {
    const values = renderers.helm.serializeService(s, uberChart)
    switch (values.type) {
      case 'error':
        throw new Error(values.errors.join('\n'))
      case 'success':
        const extras = values.serviceDef.extra
        delete values.serviceDef.extra
        return {
          ...acc,
          [s.serviceDef.name]: Object.assign({}, values.serviceDef, extras),
        }
    }
  }, uberChart.env.global)
  const servicesAndMocks = Object.entries(uberChart.deps).reduce(
    (acc, [name, svcs]) => {
      if (name.startsWith('mock-')) {
        return {
          ...acc,
          [name]: renderers.helm.serviceMockDef({
            namespace: svcs.values().next().value.serviceDef.namespace,
            target: name,
          }),
        }
      }
      return {
        ...acc,
      }
    },
    helmServices,
  )
  Object.values(servicesAndMocks)
    .filter((s) => s.grantNamespacesEnabled)
    .forEach(({ namespace, grantNamespaces }) =>
      Object.values(servicesAndMocks)
        .filter((s) => !s.grantNamespacesEnabled && s.namespace === namespace)
        .forEach((s) => {
          // Not cool but we need to change it after we've rendered all the services.
          // Preferably we would want to keep netpols somewhere else - away from the
          // application configuration.
          s.grantNamespacesEnabled = true
          s.grantNamespaces = grantNamespaces
        }),
    )
  return {
    namespaces: Array.from(
      Object.values(servicesAndMocks)
        .map((s) => s.namespace)
        .filter((n) => n)
        .reduce((prev, cur) => prev.add(cur), new Set<string>())
        .values(),
    ),
    services: servicesAndMocks,
  }
}

const findDependencies = (
  uberChart: UberChart,
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

export const getWithDependantServices = (
  uberChart: UberChart,
  habitat: Service[],
  ...services: Service[]
): Service[] => {
  renderHelmValueFile(uberChart, ...habitat) // doing this so we find out the dependencies
  const dependantServices = services
    .map((s) => findDependencies(uberChart, s, habitat))
    .flatMap((x) => x)
  return services
    .concat(dependantServices)
    .reduce(
      (acc: Service[], cur: Service): Service[] =>
        acc.indexOf(cur) === -1 ? acc.concat([cur]) : acc,
      [],
    )
}

const renderDockerComposeFile = (
  uberChart: UberChart,
  ...services: Service[]
): ValueFile<DockerComposeService> => {
  const helmServices: Services<DockerComposeService> = services.reduce(
    (acc, s) => {
      const values = serializeService(s, uberChart)
      switch (values.type) {
        case 'error':
          throw new Error(values.errors.join('\n'))
        case 'success':
          // const extras = values.serviceDef.extra
          // delete values.serviceDef.extra
          return {
            ...acc,
            [s.serviceDef.name]: values.serviceDef,
          }
      }
    },
    uberChart.env.global,
  )
  const servicesAndMocks = Object.entries(uberChart.deps).reduce(
    (acc, [name, svcs]) => {
      if (name.startsWith('mock-')) {
        return {
          ...acc,
          [name]: serviceMockDef({
            namespace: svcs.values().next().value.serviceDef.namespace,
            target: name,
          }),
        }
      }
      return {
        ...acc,
      }
    },
    helmServices,
  )
  return {
    namespaces: [],
    services: servicesAndMocks,
  }
}
