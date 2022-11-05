import { Kubernetes } from '../kubernetes-runtime'
import { Service, ServiceDefinitionForEnv } from '../types/input-types'
import {
  HelmValueFile,
  OutputFormat,
  ServiceHelm,
  ServiceOutputType,
  Services,
} from '../types/output-types'
import { renderers } from '../service-dependencies'
import { DeploymentRuntime } from '../types/charts'
import { prepareServiceForEnv } from '../service-to-environment/pre-process-service'

export const renderer = async <T extends ServiceOutputType>(
  runtime: DeploymentRuntime,
  services: Service[] | Service,
  renderer: OutputFormat<T>,
) => {
  const servicesToProcess = Array.isArray(services) ? services : [services]
  if (runtime.env.feature) {
    for (const service of servicesToProcess) {
      renderer.featureDeployment(service, runtime.env)
    }
  }
  const preparedServices: ServiceDefinitionForEnv[] = []
  for (const service of servicesToProcess) {
    const serviceForEnv = prepareServiceForEnv(service, runtime.env)
    switch (serviceForEnv.type) {
      case 'error':
        throw new Error(serviceForEnv.errors.join('\n'))
      case 'success':
        preparedServices.push(serviceForEnv.serviceDef)
    }
  }
  const outputServices = await preparedServices.reduce(async (acc, s) => {
    const accVal = await acc
    const values = await renderer.serializeService(
      s,
      runtime,
      runtime.env.feature,
    )
    switch (values.type) {
      case 'error':
        throw new Error(values.errors.join('\n'))
      case 'success':
        return { ...accVal, [s.name]: values.serviceDef[0] }
    }
  }, Promise.resolve({} as Services<T>))

  return outputServices
}
export const rendererForOne = async <T extends ServiceOutputType>(
  renderer: OutputFormat<T>,
  service: Service,
  runtime: DeploymentRuntime,
) => {
  if (runtime.env.feature) {
    renderer.featureDeployment(service, runtime.env)
  }
  const preparedServices: ServiceDefinitionForEnv[] = []
  const serviceForEnv = prepareServiceForEnv(service, runtime.env)
  switch (serviceForEnv.type) {
    case 'error':
      return serviceForEnv
    case 'success':
      preparedServices.push(serviceForEnv.serviceDef)
  }
  return renderer.serializeService(
    preparedServices[0],
    runtime,
    runtime.env.feature,
  )
}

export const renderHelmValueFile = (
  uberChart: Kubernetes,
  services: Services<ServiceHelm>,
): HelmValueFile<ServiceHelm> => {
  const outputFormat = renderers.helm
  // if (uberChart.env.feature) {
  //   processForFeatureDeployment(services, outputFormat, uberChart)
  // }
  const helmServices: Services<ServiceHelm> = Object.entries(services).reduce(
    (acc, [name, service]) => {
      const accVal = acc
      const extras = service.extra
      delete service.extra
      return {
        ...accVal,
        [name]: Object.assign({}, service, extras),
      }
    },
    uberChart.env.global,
  )
  const servicesAndMocks = Object.entries(uberChart.deps).reduce(
    (acc, [name, svcs]) => {
      if (name.startsWith('mock-')) {
        return {
          ...acc,
          [name]: outputFormat.serviceMockDef({
            namespace: svcs.values().next().value.namespace,
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
