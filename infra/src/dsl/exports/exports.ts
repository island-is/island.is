import { ServiceDefinition } from '../types/input-types'
import { Kubernetes } from '../kubernetes-runtime'
import { dumpServiceHelm } from '../file-formats/yaml'
import {
  Mocks,
  renderHelmValueFile as internalRenderHelmValueFile,
} from '../value-files-generators/render-helm-value-file'
import { DeploymentRuntime, EnvironmentConfig } from '../types/charts'
import { renderers } from '../downstream-dependencies'
import { prepareServices, renderer } from '../processing/service-sets'
import { generateJobsForFeature } from '../output-generators/feature-jobs'

export const renderHelmValueFileContent = async (
  env: EnvironmentConfig,
  services: ServiceDefinition[],
  withMocks: Mocks,
) => {
  return dumpServiceHelm(
    env,
    await renderHelmServiceFile(env, services, withMocks),
  )
}
// export const renderDockerComposeValueFileContent = async (
//   env: EnvironmentConfig,
//   services: ServiceDefinition[],
// ) => {
//   let uberChart = new Localhost(env)
//   return dumpDockerCompose(
//     uberChart,
//     await renderDockerComposeFile(
//       uberChart,
//       await renderer(uberChart, services, renderers['docker-compose']),
//     ),
//   )
// }

export const renderHelmServiceFile = async (
  env: EnvironmentConfig,
  services: ServiceDefinition[],
  withMocks: Mocks,
) => {
  const { services: renderedServices, uber } = await renderHelmServices(
    env,
    services,
  )
  return internalRenderHelmValueFile(uber, renderedServices, withMocks)
}
export const renderHelmServices = async (
  env: EnvironmentConfig,
  services: ServiceDefinition[],
) => {
  let uberChart = new Kubernetes(env)
  return {
    services: await renderer(uberChart, services, renderers.helm),
    uber: uberChart,
  }
}

export const renderHelmJobForFeature = async (
  env: DeploymentRuntime,
  habitat: ServiceDefinition[],
  image: string,
  services: ServiceDefinition[],
) => {
  const result = prepareServices(services, env, renderers.helm)
  return generateJobsForFeature(env, habitat, image, result)
}

// export const renderDockerValueFileContent = async (
//   env: EnvironmentConfig,
//   services: ServiceDefinition[],
// ) => {
//   let uberChart = new Localhost(env)
//   return dumpDockerCompose(
//     uberChart,
//     renderDockerComposeFile(
//       uberChart,
//       await renderer(uberChart, services, renderers['docker-compose']),
//     ),
//   )
// }
