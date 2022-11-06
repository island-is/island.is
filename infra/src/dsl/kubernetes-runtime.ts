import {
  Service,
  ServiceDefinition,
  ServiceDefinitionCore,
  ServiceDefinitionForEnv,
} from './types/input-types'
import { DeploymentRuntime, EnvironmentConfig } from './types/charts'

export class Kubernetes implements DeploymentRuntime {
  env: EnvironmentConfig // TODO: get rid of this?
  constructor(env: EnvironmentConfig) {
    this.env = env
  }

  deps: { [name: string]: Set<string> } = {}

  ref(from: ServiceDefinitionCore, to: Service | string) {
    if (typeof to === 'object') {
      const dependecies = this.deps[to.name] ?? new Set<string>()
      this.deps[to.name] = dependecies.add(from.name)
      const serviceReference =
        from.namespace === to.namespace
          ? `${this.env.releaseName}-${to.name}`
          : `${this.env.releaseName}-${to.name}.${to.namespace}.svc.cluster.local`
      return serviceReference
    } else {
      if (this.env.feature) {
        const dependencies = this.deps[to] ?? new Set<string>()
        this.deps[
          this.getMockName(to).replace('http://', '')
        ] = dependencies.add(from.name)
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
