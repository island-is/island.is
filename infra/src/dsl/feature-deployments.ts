import { getWithDownstreamServices } from './downstream-dependencies'
import { ServiceBuilder } from './dsl'
import { EnvironmentConfig } from './types/charts'

export const getFeatureAffectedServices = async (
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  excludedServices: ServiceBuilder<any>[] = [],
  env: EnvironmentConfig,
) => {
  const feature = env.feature
  if (typeof feature !== 'undefined') {
    const excludedServiceNames = excludedServices.map((f) => f.serviceDef.name)

    const affectedServices = (
      await getWithDownstreamServices(env, habitat, services)
    ).reduce(
      (acc, f) =>
        excludedServiceNames.includes(f.serviceDef.name)
          ? { included: acc.included, excluded: [...acc.excluded, f.name()] }
          : { included: [...acc.included, f], excluded: acc.excluded },
      {
        included: [] as ServiceBuilder<any>[],
        excluded: [] as string[],
      },
    )
    return affectedServices
  } else {
    throw new Error('Feature deployment with a feature name not defined')
  }
}
