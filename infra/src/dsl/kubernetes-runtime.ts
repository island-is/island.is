import { Service } from './types/input-types'
import { DeploymentRuntime, EnvironmentConfig } from './types/charts'

export class Kubernetes implements DeploymentRuntime {
  env: EnvironmentConfig // TODO: get rid of this?
  constructor(env: EnvironmentConfig) {
    this.env = env
  }

  deps: { [name: string]: Set<Service> } = {}

  ref(from: Service, to: Service | string) {
    if (typeof to === 'object') {
      const dependecies = this.deps[to.serviceDef.name] ?? new Set<Service>()
      this.deps[to.serviceDef.name] = dependecies.add(from)
      const serviceReference =
        from.serviceDef.namespace === to.serviceDef.namespace
          ? `${this.env.releaseName}-${to.serviceDef.name}`
          : `${this.env.releaseName}-${to.serviceDef.name}.${to.serviceDef.namespace}.svc.cluster.local`
      return serviceReference
    } else {
      if (this.env.feature) {
        const dependencies = this.deps[to] ?? new Set<Service>()
        this.deps[
          this.getMockName(to).replace('http://', '')
        ] = dependencies.add(from)
        return this.getMockName(to)
      } else {
        return to
      }
    }
  }

  private getMockName(to: string) {
    const parsed = new URL(to)
    parsed.protocol = 'http:'
    parsed.host = `mock-${parsed.host.replace(/\./g, '-')}`
    return parsed.href.slice(0, parsed.href.length - (to.endsWith('/') ? 0 : 1))
  }
}
