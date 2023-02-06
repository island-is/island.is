import { Kubernetes } from '../kubernetes-runtime'
import { dumpKubeYaml } from '../file-formats/yaml'
import { getKubeValueFile } from '../value-files-generators/kube-value-file'
import { EnvironmentConfig } from '../types/charts'
import { renderers } from '../upstream-dependencies'
import { generateOutput } from '../processing/rendering-pipeline'

import { ServiceBuilder } from '../dsl'

export const renderKubeValueFileContent = async (
  services: ServiceBuilder<any>[],
  env: EnvironmentConfig,
) => {
  return dumpKubeYaml(await renderKubeDeploymentFile(services, env))
}

export const renderKubeDeploymentFile = async (
  services: ServiceBuilder<any>[],
  env: EnvironmentConfig,
) => {
  const { services: renderedServices } = await renderKubeDeployments(
    services,
    env,
  )
  return getKubeValueFile(renderedServices, env)
}
export const renderKubeDeployments = async (
  services: ServiceBuilder<any>[],
  env: EnvironmentConfig,
) => {
  let runtime = new Kubernetes(env)
  return {
    services: await generateOutput({
      runtime: runtime,
      services: services,
      outputFormat: renderers.kube,
      env: env,
    }),
    runtime: runtime,
  }
}
