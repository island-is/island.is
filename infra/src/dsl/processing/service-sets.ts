import {
  OutputFormat,
  ServiceOutputType,
  Services,
} from '../types/output-types'
import { DeploymentRuntime } from '../types/charts'
import {
  ServiceDefinition,
  ServiceDefinitionForEnv,
} from '../types/input-types'
import { prepareServiceForEnv } from '../service-to-environment/pre-process-service'

export function prepareServices<T extends ServiceOutputType>(
  services: ServiceDefinition[] | ServiceDefinition,
  runtime: DeploymentRuntime,
  renderer: OutputFormat<T>,
) {
  const servicesToProcess = Array.isArray(services) ? services : [services]

  if (runtime.env.feature) {
    for (const service of servicesToProcess) {
      renderer.featureDeployment(service, runtime.env)
    }
  }

  const preparedServices = servicesToProcess.map((service) => {
    const serviceForEnv = prepareServiceForEnv(service, runtime.env)
    switch (serviceForEnv.type) {
      case 'error':
        throw new Error(serviceForEnv.errors.join('\n'))
      case 'success':
        return serviceForEnv.serviceDef
    }
  })
  return preparedServices
}

export const renderer = async <T extends ServiceOutputType>(
  runtime: DeploymentRuntime,
  services: ServiceDefinition[] | ServiceDefinition,
  renderer: OutputFormat<T>,
) => {
  const preparedServices = prepareServices(services, runtime, renderer)

  return preparedServices.reduce(async (acc, s) => {
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
}
export const rendererForOne = async <T extends ServiceOutputType>(
  renderer: OutputFormat<T>,
  service: ServiceDefinition,
  runtime: DeploymentRuntime,
) => {
  if (runtime.env.feature) {
    renderer.featureDeployment(service, runtime.env)
  }
  const serviceForEnv = prepareServiceForEnv(service, runtime.env)
  switch (serviceForEnv.type) {
    case 'error':
      return serviceForEnv
    case 'success':
      return renderer.serializeService(
        serviceForEnv.serviceDef,
        runtime,
        runtime.env.feature,
      )
  }
}
