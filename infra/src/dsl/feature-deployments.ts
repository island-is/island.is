import { Service } from './types/input-types'
import { GRAPHQL_API_URL_ENV_VAR_NAME } from '../../../apps/application-system/api/infra/application-system-api'
import { Kubernetes } from './kubernetes'
import { getWithDependantServices } from './service-dependencies'
import { DockerComposeService, ValueFile } from './types/output-types'
import { dump } from 'js-yaml'
import { dumpOpts } from './yaml'
import { EnvironmentConfig } from './types/charts'
import { renderHelmValueFile } from './output-generators/render-helm-value-file'

export function featureSpecificServiceDef(featureSpecificServices: Service[]) {
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

async function featureSpecificServicesPrepare(
  env: EnvironmentConfig,
  habitat: Service[],
  services: Service[],
) {
  const featureSpecificServices = await getWithDependantServices(
    env,
    habitat,
    ...services,
  )
  featureSpecificServiceDef(featureSpecificServices)
  return featureSpecificServices
}

export const generateYamlForFeature = async (
  uberChart: Kubernetes,
  habitat: Service[],
  services: Service[],
  excludedServices: Service[] = [],
) => {
  const feature = uberChart.env.feature
  if (typeof feature !== 'undefined') {
    const excludedServiceNames = excludedServices.map((f) => f.serviceDef.name)

    const featureSpecificServices = (
      await featureSpecificServicesPrepare(uberChart.env, habitat, services)
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
