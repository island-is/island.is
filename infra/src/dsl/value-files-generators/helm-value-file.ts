import { Kubernetes } from '../kubernetes-runtime'
import { HelmValueFile, HelmService, Services } from '../types/output-types'
import { renderers } from '../upstream-dependencies'
import { EnvironmentConfig } from '../types/charts'

/**
 * Type representing whether mocks should be included or not.
 */
export type Mocks = 'with-mocks' | 'no-mocks'

/**
 * Generates a Helm value file based on the provided Kubernetes runtime, services, mock configuration, and environment configuration.
 *
 * @param runtime - The Kubernetes runtime environment.
 * @param services - The services to be included in the Helm value file.
 * @param withMocks - Indicates whether to include mock services.
 * @param env - The environment configuration.
 * @returns A HelmValueFile containing namespaces and services.
 */
export const getHelmValueFile = (
  runtime: Kubernetes,
  services: Services<HelmService>,
  withMocks: Mocks,
  env: EnvironmentConfig,
): HelmValueFile => {
  const outputFormat = renderers.helm
  const helmServices: Services<HelmService> = Object.entries(services).reduce(
    (acc, [name, service]) => {
      const extras = service.extra
      delete service.extra
      return {
        ...acc,
        [name]: Object.assign({}, service, extras),
      }
    },
    env.global,
  )
  const mocks: Services<HelmService> =
    withMocks === 'with-mocks' && Object.keys(runtime.mocks).length > 0
      ? {
          'mock-server': outputFormat.serviceMockDef({
            runtime: runtime,
            env,
          }),
        }
      : {}
  const servicesAndMocks: Services<HelmService> = { ...helmServices, ...mocks }

  // Grant namespaces to services that don't have them
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
