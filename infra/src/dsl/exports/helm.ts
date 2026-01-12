import { Kubernetes } from '../kubernetes-runtime'
import { dumpServiceHelm } from '../file-formats/yaml'
import {
  getHelmValueFile,
  Mocks,
} from '../value-files-generators/helm-value-file'
import { EnvironmentConfig } from '../types/charts'
import { renderers } from '../upstream-dependencies'
import {
  prepareServicesForEnv,
  generateOutput,
} from '../processing/rendering-pipeline'
import { generateJobsForFeature } from '../output-generators/feature-jobs'
import { generateCleanUpForFeature } from '../output-generators/feature-jobs'
import { ServiceBuilder } from '../dsl'
import { hacks } from './hacks'

export const renderHelmValueFileContent = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  withMocks: Mocks,
  skipAppName: boolean = false,
) => {
  return dumpServiceHelm(
    env,
    await renderHelmServiceFile(env, habitat, services, withMocks, skipAppName),
  )
}

export const renderHelmServiceFile = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  withMocks: Mocks,
  skipAppName: boolean = false,
) => {
  const { services: renderedServices, runtime } = await renderHelmServices(
    env,
    habitat,
    services,
    withMocks,
  )
  return getHelmValueFile(
    runtime,
    renderedServices,
    withMocks,
    env,
    skipAppName,
  )
}
export const renderHelmServices = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  withMocks: Mocks,
) => {
  let runtime = new Kubernetes(env, withMocks)
  hacks(services, habitat)
  return {
    services: await generateOutput({
      runtime: runtime,
      services: services,
      outputFormat: renderers.helm,
      env: env,
    }),
    runtime: runtime,
  }
}

export const renderHelmJobForFeature = async (
  env: EnvironmentConfig,
  image: string,
  services: ServiceBuilder<any>[],
) => {
  const result = prepareServicesForEnv({
    services: services,
    env: env,
    outputFormat: renderers.helm,
  })
  return generateJobsForFeature(image, result, env)
}

export const renderCleanUpForFeature = async (
  env: EnvironmentConfig,
  image: string,
  services: ServiceBuilder<any>[],
) => {
  const result = prepareServicesForEnv({
    services: services,
    env: env,
    outputFormat: renderers.helm,
  })
  return generateCleanUpForFeature(image, result, env)
}
