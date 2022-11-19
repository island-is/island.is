import { Kubernetes } from '../kubernetes-runtime'
import { dumpServiceHelm } from '../file-formats/yaml'
import {
  Mocks,
  helmValueFile,
} from '../value-files-generators/render-helm-value-file'
import { EnvironmentConfig } from '../types/charts'
import { renderers } from '../upstream-dependencies'
import { prepareServices, renderer } from '../processing/service-sets'
import { generateJobsForFeature } from '../output-generators/feature-jobs'
import { ServiceBuilder } from '../dsl'
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
  )
  return helmValueFile(runtime, renderedServices, withMocks, env)
}
export const renderHelmServices = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
) => {
  let runtime = new Kubernetes(env)
  hacks(services, habitat)
  return {
    services: await renderer(runtime, services, renderers.helm, env),
    runtime: runtime,
  }
}

export const renderHelmJobForFeature = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  image: string,
  services: ServiceBuilder<any>[],
) => {
  const result = prepareServices(services, env, renderers.helm)
  return generateJobsForFeature(image, result, env)
}
