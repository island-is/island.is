import { ServiceDefinition } from '../types/input-types'
import { Kubernetes } from '../kubernetes-runtime'
import { dumpDockerCompose, dumpServiceHelm } from '../file-formats/yaml'
import { renderHelmValueFile as internalRenderHelmValueFile } from '../value-files-generators/render-helm-value-file'
import { DeploymentRuntime, EnvironmentConfig } from '../types/charts'
import { renderers } from '../service-dependencies'
import { prepareServices, renderer } from '../processing/service-sets'
import { generateJobsForFeature } from '../output-generators/feature-jobs'
import { renderDockerComposeFile } from '../value-files-generators/render-docker-compose-file'

export const renderHelmValueFileContent = async (
  env: EnvironmentConfig,
  services: ServiceDefinition[],
) => {
  let uberChart = new Kubernetes(env)
  return dumpServiceHelm(
    uberChart,
    await internalRenderHelmValueFile(
      uberChart,
      await renderer(uberChart, services, renderers.helm),
    ),
  )
}

export const renderHelmServiceFile = async (
  env: EnvironmentConfig,
  services: ServiceDefinition[],
) => {
  let uberChart = new Kubernetes(env)
  return internalRenderHelmValueFile(
    uberChart,
    await renderer(uberChart, services, renderers.helm),
  )
}
export const renderHelmServices = async (
  env: EnvironmentConfig,
  services: ServiceDefinition[],
) => {
  let uberChart = new Kubernetes(env)
  return await renderer(uberChart, services, renderers.helm)
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

export const renderDockerValueFileContent = async (
  env: EnvironmentConfig,
  services: ServiceDefinition[],
) => {
  let uberChart = new Kubernetes(env)
  return dumpDockerCompose(
    uberChart,
    renderDockerComposeFile(
      uberChart,
      await renderer(uberChart, services, renderers['docker-compose']),
    ),
  )
}
