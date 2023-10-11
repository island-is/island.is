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
import { ServiceBuilder } from '../dsl'
import { hacks } from './hacks'

export const renderHelmValueFileContent = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  withMocks: Mocks,
  dockerTag?: string,
) => {
  return dumpServiceHelm(
    env,
    await renderHelmServiceFile(env, dockerTag, habitat, services, withMocks),
  )
}

export const renderHelmServiceFile = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  withMocks: Mocks,
  dockerTag?: string,
) => {
  const { services: renderedServices, runtime } = await renderHelmServices(
    env,
    habitat,
    services,
    withMocks,
    dockerTag,
  )
  return getHelmValueFile(runtime, renderedServices, withMocks, env)
}
export const renderHelmServices = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  withMocks: Mocks,
  dockerTag?: string,
) => {
  let runtime = new Kubernetes(env, withMocks)
  hacks(services, habitat, dockerTag)
  return {
    services: await generateOutput({
      runtime: runtime,
      services: services,
      outputFormat: renderers.helm,
      env: env,
      dockerTag: dockerTag,
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
