import { KubeValueFile, KubeService, Services } from '../types/output-types'
import { renderers } from '../upstream-dependencies'
import { EnvironmentConfig } from '../types/charts'

export const getKubeValueFile = (
  services: Services<KubeService>,
  env: EnvironmentConfig,
): KubeValueFile => {
  const outputFormat = renderers.kube
  const kubeServices: Services<KubeService> = services

  const service = { ...kubeServices }
  return {
    services: services,
  }
}
