import { ServiceDefinition } from './types/input-types'
import { Kubernetes } from './kubernetes-runtime'
import { getWithDownstreamServices } from './downstream-dependencies'

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
      await getWithDownstreamServices(uberChart.env, habitat, services)
    ).filter((f) => !excludedServiceNames.includes(f.name))
  } else {
    throw new Error('Feature deployment with a feature name not defined')
  }
}
