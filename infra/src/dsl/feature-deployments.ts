import { ServiceDefinition } from './types/input-types'
import { Kubernetes } from './kubernetes-runtime'
import { getWithDownstreamServices } from './downstream-dependencies'
import { ServiceBuilder } from './dsl'

export const getFeatureAffectedServices = async (
  uberChart: Kubernetes,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  excludedServices: ServiceBuilder<any>[] = [],
) => {
  const feature = uberChart.env.feature
  if (typeof feature !== 'undefined') {
    const excludedServiceNames = excludedServices.map((f) => f.serviceDef.name)

    return (
      await getWithDownstreamServices(uberChart.env, habitat, services)
    ).filter((f) => !excludedServiceNames.includes(f.serviceDef.name))
  } else {
    throw new Error('Feature deployment with a feature name not defined')
  }
}
