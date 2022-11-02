import { PostgresInfo, Service } from './types/input-types'
import { GRAPHQL_API_URL_ENV_VAR_NAME } from '../../../apps/application-system/api/infra/application-system-api'
import { postgresIdentifier } from './map-to-docker-compose'
import { Kubernetes } from './kubernetes'
import {
  getWithDependantServices,
  renderHelmValueFile,
} from './process-services'
import { DockerComposeService, ValueFile } from './types/output-types'
import { dump } from 'js-yaml'
import { dumpOpts } from './yaml'

export const resolveWithMaxLength = (str: string, max: number) => {
  if (str.length > max) {
    return `${str.substr(0, Math.ceil(max / 3))}${str.substr((-max / 3) * 2)}`
  }
  return str
}
export const getPostgresInfoForFeature = (
  feature: string,
  postgres?: PostgresInfo,
): PostgresInfo | undefined => {
  if (postgres) {
    const postgresCopy = { ...postgres }
    postgresCopy.passwordSecret = postgres.passwordSecret?.replace(
      '/k8s/',
      `/k8s/feature-${feature}-`,
    )
    postgresCopy.name = resolveWithMaxLength(
      `feature_${postgresIdentifier(feature)}_${postgres.name}`,
      60,
    )
    postgresCopy.username = resolveWithMaxLength(
      `feature_${postgresIdentifier(feature)}_${postgres.username}`,
      60,
    )
    return postgresCopy
  }
  return postgres
}

export function featureSpecificServiceDef(
  feature: string,
  featureSpecificServices: Service[],
) {
  const namespace = `feature-${feature}`
  featureSpecificServices.forEach((s) => {
    s.serviceDef.namespace = namespace
    s.serviceDef.replicaCount = { min: 1, max: 2, default: 1 }
  })
  featureSpecificServices.forEach((s) => {
    Object.entries(s.serviceDef.ingress).forEach(([name, ingress]) => {
      if (!Array.isArray(ingress.host.dev)) {
        ingress.host.dev = [ingress.host.dev]
      }
      ingress.host.dev = ingress.host.dev.map((host) => `${feature}-${host}`)
    })
  })
  featureSpecificServices.forEach((s) => {
    s.serviceDef.postgres = getPostgresInfoForFeature(
      feature,
      s.serviceDef.postgres,
    )
    if (s.serviceDef.initContainers) {
      s.serviceDef.initContainers.postgres = getPostgresInfoForFeature(
        feature,
        s.serviceDef.initContainers.postgres,
      )
    }
  })
  const hackForThatOneCircularDependency = () => {
    const isApiServicePresent = featureSpecificServices.some(
      (s) => s.serviceDef.name === 'api',
    )
    const applicationSystemAPI = featureSpecificServices.find(
      (s) => s.serviceDef.name === 'application-system-api',
    )
    if (isApiServicePresent && applicationSystemAPI) {
      applicationSystemAPI.serviceDef.env[GRAPHQL_API_URL_ENV_VAR_NAME] =
        'http://web-api'
    }
  }
  hackForThatOneCircularDependency()
}

function featureSpecificServicesPrepare(
  uberChart: Kubernetes,
  habitat: Service[],
  services: Service[],
  feature: string,
) {
  const featureSpecificServices = getWithDependantServices(
    uberChart,
    habitat,
    ...services,
  )
  featureSpecificServiceDef(feature, featureSpecificServices)
  return featureSpecificServices
}

export const generateYamlForFeature = (
  uberChart: Kubernetes,
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
    return renderHelmValueFile(uberChart, ...featureSpecificServices)
  } else {
    throw new Error('Feature deployment with a feature name not defined')
  }
}
export const dumpDockerCompose = (
  ch: Kubernetes,
  valueFile: ValueFile<DockerComposeService>,
) => {
  const { services } = valueFile
  const namespaceLabels = ch.env.feature ? { namespaceType: 'feature' } : {}
  return dump(services, dumpOpts)
}
