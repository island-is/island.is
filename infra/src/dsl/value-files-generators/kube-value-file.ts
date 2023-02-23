import { KubeValueFile, KubeDeployment, Services } from '../types/output-types'
import { renderers } from '../upstream-dependencies'
import { EnvironmentConfig } from '../types/charts'

export const getKubeValueFile = (
  services: Services<KubeDeployment>,
  env: EnvironmentConfig,
): KubeValueFile => {
  const outputFormat = renderers.kube
  const kubeDeployments: Services<KubeDeployment> = services

  const service = { ...kubeDeployments }
  return {
    services: services,
  }
}
