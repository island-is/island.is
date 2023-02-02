import { Kubernetes } from '../kubernetes-runtime'
import { KubeValueFile, KubeService, Services } from '../types/output-types'
import { renderers } from '../upstream-dependencies'
import { EnvironmentConfig } from '../types/charts'

export const getKubeValueFile = (
  services: Services<KubeService>,
  env: EnvironmentConfig,
): KubeValueFile => {
  const outputFormat = renderers.helm
  const kubeServices: Services<KubeService> = Object.entries(services).reduce(
    (acc, [name, service]) => {
      return {
        ...acc,
        [name]: Object.assign({}, service),
      }
    },
    env.global,
  )
  const service = { ...kubeServices }
  return {
    namespaces: Array.from(
      Object.values(services)
        .map((s) => s.metadata.namespace)
        .filter((n) => n)
        .reduce((prev, cur) => prev.add(cur), new Set<string>())
        .values(),
    ),
    services: services,
  }
}
