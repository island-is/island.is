import {
  OutputFormat,
  ServiceOutputType,
  Services,
} from '../types/output-types'
import { DeploymentRuntime, EnvironmentConfig } from '../types/charts'
import { ServiceDefinition } from '../types/input-types'
import { prepareServiceForEnv } from '../service-to-environment/pre-process-service'
import { ServiceBuilder } from '../dsl'

export function prepareServices<T extends ServiceOutputType>(
  services: ServiceBuilder<any>[] | ServiceBuilder<any>,
  env: EnvironmentConfig,
  renderer: OutputFormat<T>,
) {
  const servicesToProcess = Array.isArray(services) ? services : [services]

  if (env.feature) {
    for (const service of servicesToProcess) {
      renderer.featureDeployment(service.serviceDef, env)
    }
  }

  return servicesToProcess.map((service) => {
    const serviceForEnv = prepareServiceForEnv(service.serviceDef, env)
    switch (serviceForEnv.type) {
      case 'error':
        throw new Error(serviceForEnv.errors.join('\n'))
      case 'success':
        return serviceForEnv.serviceDef
    }
  })
}

export const renderer = async <T extends ServiceOutputType>(
  runtime: DeploymentRuntime,
  services: ServiceBuilder<any>[] | ServiceBuilder<any>,
  renderer: OutputFormat<T>,
  env: EnvironmentConfig,
) => {
  const preparedServices = prepareServices(services, env, renderer)

  return preparedServices.reduce(async (acc, s) => {
    const accVal = await acc
    const values = await renderer.serializeService(s, runtime, env, env.feature)
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
  env: EnvironmentConfig,
) => {
  if (env.feature) {
    renderer.featureDeployment(service, env)
  }
  const serviceForEnv = prepareServiceForEnv(service, env)
  switch (serviceForEnv.type) {
    case 'error':
      return serviceForEnv
    case 'success':
      return renderer.serializeService(
        serviceForEnv.serviceDef,
        runtime,
        env,
        env.feature,
      )
  }
}
