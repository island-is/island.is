import {
  OutputFormat,
  SerializeErrors,
  SerializeSuccess,
  ServiceOutputType,
  Services,
} from '../types/output-types'
import { ReferenceResolver, EnvironmentConfig } from '../types/charts'
import { prepareServiceForEnv } from '../service-to-environment/pre-process-service'
import { ServiceBuilder } from '../dsl'

export function prepareServicesForEnv<T extends ServiceOutputType>(options: {
  services: ServiceBuilder<any>[] | ServiceBuilder<any>
  env: EnvironmentConfig
  outputFormat: OutputFormat<T>
}) {
  const servicesToProcess = Array.isArray(options.services)
    ? options.services
    : [options.services]

  if (options.env.feature) {
    for (const service of servicesToProcess) {
      options.outputFormat.featureDeployment(service.serviceDef, options.env)
    }
  }

  return servicesToProcess.map((service) => {
    const serviceForEnv = prepareServiceForEnv(service.serviceDef, options.env)
    switch (serviceForEnv.type) {
      case 'error':
        throw new Error(serviceForEnv.errors.join('\n'))
      case 'success':
        return serviceForEnv.serviceDef
    }
  })
}

/**
 * This is an important function. It converts a list of ServiceBuilders to a hash of output-format-specific definitions. It is practically the rendering pipeline for the DSL definitions
 * @param options
 */
export const generateOutput = async <T extends ServiceOutputType>(options: {
  runtime: ReferenceResolver
  services: ServiceBuilder<any>[] | ServiceBuilder<any>
  outputFormat: OutputFormat<T>
  env: EnvironmentConfig
}) => {
  const runtime = options.runtime
  const services = options.services
  const outputFormat = options.outputFormat
  const env = options.env
  const preparedServices = prepareServicesForEnv({
    services: services,
    env: env,
    outputFormat: outputFormat,
  })

  return preparedServices.reduce(async (acc, s) => {
    const accVal = await acc
    const values = await outputFormat.serializeService(
      s,
      runtime,
      env,
      env.feature,
    )
    switch (values.type) {
      case 'error':
        throw new Error(values.errors.join('\n'))
      case 'success':
        return { ...accVal, [s.name]: values.serviceDef[0] }
    }
  }, Promise.resolve({} as Services<T>))
}

/**
 * This is the same as `renderer` function but for a single service. Used in tests for the most part.
 * @param options
 */
export const generateOutputOne = async <T extends ServiceOutputType>(options: {
  outputFormat: OutputFormat<T>
  service: ServiceBuilder<any>
  runtime: ReferenceResolver
  env: EnvironmentConfig
}): Promise<SerializeSuccess<T> | SerializeErrors> => {
  const outputFormat = options.outputFormat
  const service = options.service
  const runtime = options.runtime
  const env = options.env
  try {
    const result = await generateOutput({
      runtime: runtime,
      services: service,
      outputFormat: outputFormat,
      env: env,
    })
    return { type: 'success', serviceDef: [Object.values(result)[0]!] }
  } catch (e: any) {
    return { type: 'error', errors: e.message.split('\n') }
  }
}
