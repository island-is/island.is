import { Service } from './types/input-types'
import { Kubernetes } from './kubernetes-runtime'
import { getWithDependantServices } from './service-dependencies'
import { EnvironmentConfig } from './types/charts'
import { featureSpecificServiceDef } from './feature-specific-hacks/feature-specific-service-def'

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

export const getFeatureAffectedServices = async (
  uberChart: Kubernetes,
  habitat: Service[],
  services: Service[],
  excludedServices: Service[] = [],
) => {
  const feature = uberChart.env.feature
  if (typeof feature !== 'undefined') {
    const excludedServiceNames = excludedServices.map((f) => f.serviceDef.name)

    return (
      await featureSpecificServicesPrepare(uberChart.env, habitat, services)
    ).filter((f) => !excludedServiceNames.includes(f.serviceDef.name))
  } else {
    throw new Error('Feature deployment with a feature name not defined')
  }
}
