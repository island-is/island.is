import { ServiceDefinition } from './types/input-types'
import { Kubernetes } from './kubernetes-runtime'
import { getWithDependantServices } from './service-dependencies'
import { ServiceBuilder } from './dsl'

export const getFeatureAffectedServices = async (
  uberChart: Kubernetes,
  habitat: ServiceDefinition[],
  services: ServiceDefinition[],
  excludedServices: ServiceDefinition[] = [],
) => {
  const feature = uberChart.env.feature
  if (typeof feature !== 'undefined') {
    const excludedServiceNames = excludedServices.map((f) => f.name)

    return (
      await getWithDependantServices(uberChart.env, habitat, services)
    ).filter((f) => !excludedServiceNames.includes(f.name))
  } else {
    throw new Error('Feature deployment with a feature name not defined')
  }
}

export const toServices = (builders: ServiceBuilder<any>[]) =>
  builders.map((b) => b.serviceDef)
