import { dump, load } from 'js-yaml'
import { serializeService } from './map-to-values'
import { PostgresInfo, Service } from './types/input-types'
import { UberChart } from './uber-chart'
import { ValueFile, FeatureKubeJob, Services } from './types/output-types'

const MAX_LEVEL_DEPENDENCIES = 20
const dumpOpts = {
  sortKeys: true,
  noRefs: true,
  forceQuotes: true,
}

const renderValueFile = (
  uberChart: UberChart,
  featureDeployment?: string,
  ...services: Service[]
): ValueFile => {
  const helmServices: Services = services.reduce((acc, s) => {
    const values = serializeService(s, uberChart, featureDeployment)
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
  Object.values(helmServices)
    .filter((s) => s.grantNamespacesEnabled)
    .forEach(({ namespace, grantNamespaces }) =>
      Object.values(helmServices)
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
      Object.values(helmServices)
        .map((s) => s.namespace)
        .filter((n) => n)
        .reduce((prev, cur) => prev.add(cur), new Set<string>())
        .values(),
    ),
    services: helmServices,
  }
}

export const reformatYaml = (content: string): string => {
  const obj = load(content, { json: true })
  return dump(obj, dumpOpts)
}

export const generateYamlForEnv = (
  uberChart: UberChart,
  ...services: Service[]
): ValueFile => {
  return renderValueFile(uberChart, undefined, ...services)
}

export const dumpYaml = (ch: UberChart, valueFile: ValueFile) => {
  const { namespaces, services } = valueFile
  const namespaceLabels = ch.env.feature ? { namespaceType: 'feature' } : {}
  return dump(
    { namespaces: { namespaces, labels: namespaceLabels }, ...services },
    dumpOpts,
  )
}

export const dumpJobYaml = (job: FeatureKubeJob) => dump(job, dumpOpts)

const findDependencies = (
  uberChart: UberChart,
  svc: Service,
  level: number = 0,
): Service[] => {
  const deps = uberChart.deps[svc.serviceDef.name]
  if (level > MAX_LEVEL_DEPENDENCIES)
    throw new Error(
      `Too deep level of dependencies - ${MAX_LEVEL_DEPENDENCIES}. Some kind of circular dependency or you fellas have gone off the deep end ;)`,
    )
  if (deps) {
    const serviceDependencies = Array.from(deps)
    return serviceDependencies
      .map((dependency) => findDependencies(uberChart, dependency, level + 1))
      .flatMap((x) => x)
      .concat(serviceDependencies)
  } else {
    return []
  }
}

export const getDependantServices = (
  uberChart: UberChart,
  habitat: Service[],
  featureDeployment?: string,
  ...services: Service[]
): Service[] => {
  renderValueFile(uberChart, featureDeployment, ...habitat) // doing this so we find out the dependencies
  const dependantServices = services
    .map((s) => findDependencies(uberChart, s))
    .flatMap((x) => x)
  return services
    .concat(dependantServices)
    .reduce(
      (acc: Service[], cur: Service): Service[] =>
        acc.indexOf(cur) === -1 ? acc.concat([cur]) : acc,
      [],
    )
}

export function featureSpecificServiceDef(
  feature: string,
  featureSpecificServices: Service[],
) {}

function featureSpecificServicesPrepare(
  uberChart: UberChart,
  habitat: Service[],
  services: Service[],
  feature: string,
) {
  const featureSpecificServices = getDependantServices(
    uberChart,
    habitat,
    feature,
    ...services,
  )
  featureSpecificServiceDef(feature, featureSpecificServices)
  return featureSpecificServices
}

export const generateYamlForFeature = (
  uberChart: UberChart,
  habitat: Service[],
  services: Service[],
  excludedServices: Service[] = [],
) => {
  const feature = uberChart.env.feature
  if (typeof feature !== 'undefined') {
    const excludedServiceNames = excludedServices.map((f) => f.serviceDef.name)

    const featureSpecificServices = featureSpecificServicesPrepare(
      uberChart,
      habitat,
      services,
      feature,
    ).filter((f) => !excludedServiceNames.includes(f.serviceDef.name))
    return renderValueFile(uberChart, feature, ...featureSpecificServices)
  } else {
    throw new Error('Feature deployment with a feature name not defined')
  }
}

export const resolveWithMaxLength = (str: string, max: number) => {
  if (str.length > max) {
    return `${str.substr(0, Math.ceil(max / 3))}${str.substr((-max / 3) * 2)}`
  }
  return str
}
