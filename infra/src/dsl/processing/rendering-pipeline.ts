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
import { logger } from '../../common'

export function prepareServicesForEnv<T extends ServiceOutputType>(options: {
  services: ServiceBuilder<any>[] | ServiceBuilder<any>
  env: EnvironmentConfig
  outputFormat: OutputFormat<T>
}) {
  logger.debug('prepareServicesForEnv', {
    numberOfServices: Array.isArray(options.services)
      ? options.services.length
      : 1,
    env: options.env,
  })
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
 * Asynchronously generates output from a list of ServiceBuilders.
 *
 * This function is a key part of the rendering pipeline for DSL definitions. It takes a list of ServiceBuilders and converts them into a hash of output-format-specific definitions.
 *
 * @param {ReferenceResolver} params.runtime - The runtime reference resolver.
 * @param {ServiceBuilder<any>[] | ServiceBuilder<any>} params.services - The list of ServiceBuilders to be converted.
 * @param {OutputFormat<T>} params.outputFormat - The output format for the conversion (e.g. `HelmOutput` or `LocalrunOutput`).
 * @param {EnvironmentConfig} params.env - The environment configuration.
 *
 * @returns {Promise<Services<T>>} A promise that resolves to a hash of output-format-specific definitions.
 *
 * @template T - The type of the service output.
 */
export async function generateOutput<T extends ServiceOutputType>({
  runtime,
  services,
  outputFormat,
  env,
}: {
  runtime: ReferenceResolver
  services: ServiceBuilder<any>[] | ServiceBuilder<any>
  outputFormat: OutputFormat<T>
  env: EnvironmentConfig
}): Promise<Services<T>> {
  logger.debug('generateOutput', {
    numberOfServices: Array.isArray(services) ? services.length : 1,
    env: env,
  })
  const preparedServices = prepareServicesForEnv({
    services: services,
    env: env,
    outputFormat: outputFormat,
  })

  logger.debug('Serializing services', {
    numberOfServices: preparedServices.length,
    services: preparedServices.map((s) => s.name),
    env: env,
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
export async function generateOutputOne<T extends ServiceOutputType>(options: {
  outputFormat: OutputFormat<T>
  service: ServiceBuilder<any>
  runtime: ReferenceResolver
  env: EnvironmentConfig
}): Promise<SerializeSuccess<T> | SerializeErrors> {
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
