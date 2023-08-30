import { ServiceBuilder } from '../dsl'
import { dumpServiceHelm } from '../file-formats/yaml'
import { Kubernetes } from '../kubernetes-runtime'
import { generateJobsForFeature } from '../output-generators/feature-jobs'
import {
  generateOutput,
  prepareServicesForEnv,
} from '../processing/rendering-pipeline'
import { EnvironmentConfig } from '../types/charts'
import { renderers } from '../upstream-dependencies'
import {
  getHelmValueFile,
  Mocks,
} from '../value-files-generators/helm-value-file'
import { hacks } from './hacks'

export const renderHelmValueFileContent = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  withMocks: Mocks,
) => {
  return dumpServiceHelm(
    env,
    await renderHelmServiceFile(env, habitat, services, withMocks),
  )
}

export const renderHelmServiceFile = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  withMocks: Mocks,
) => {
  const { services: renderedServices, runtime } = await renderHelmServices(
    env,
    habitat,
    services,
    withMocks,
  )
  return getHelmValueFile(runtime, renderedServices, withMocks, env)
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
