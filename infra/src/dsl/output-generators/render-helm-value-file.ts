import { Kubernetes } from '../kubernetes-runtime'
import { Service } from '../types/input-types'
import { ServiceHelm, Services, ValueFile } from '../types/output-types'
import { renderers } from '../service-dependencies'
import { processForFeatureDeployment } from '../process-for-feature-deployment'

export const renderHelmValueFile = async (
  uberChart: Kubernetes,
  services: Service[],
): Promise<ValueFile<ServiceHelm>> => {
  const outputFormat = renderers.helm
  if (uberChart.env.feature) {
    processForFeatureDeployment(services, outputFormat, uberChart)
  }
  const helmServices: Services<ServiceHelm> = await services.reduce(
    async (acc, s) => {
      const accVal = await acc
      const values = await outputFormat.serializeService(
        s,
        uberChart,
        uberChart.env.feature,
      )
      switch (values.type) {
        case 'error':
          throw new Error(values.errors.join('\n'))
        case 'success':
          const extras = values.serviceDef[0].extra
          delete values.serviceDef[0].extra
          return Promise.resolve({
            ...accVal,
            [s.serviceDef.name]: Object.assign(
              {},
              values.serviceDef[0],
              extras,
            ),
          })
      }
    },
    Promise.resolve(uberChart.env.global),
  )
  const servicesAndMocks = Object.entries(uberChart.deps).reduce(
    (acc, [name, svcs]) => {
      if (name.startsWith('mock-')) {
        return {
          ...acc,
          [name]: outputFormat.serviceMockDef({
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
