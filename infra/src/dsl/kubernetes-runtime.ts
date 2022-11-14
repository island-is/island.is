import { ServiceDefinition, ServiceDefinitionCore } from './types/input-types'
import { DeploymentRuntime, EnvironmentConfig } from './types/charts'
import { getMockName, hostPortNumber } from './mocks/mocks-support'

export class Kubernetes implements DeploymentRuntime {
  env: EnvironmentConfig // TODO: get rid of this?
  constructor(env: EnvironmentConfig) {
    this.env = env
  }

  deps: { [name: string]: Set<string> } = {}
  ports: { [name: string]: number } = {}
  mocks: { [name: string]: string } = {}

  ref(from: ServiceDefinitionCore, to: ServiceDefinition | string) {
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
        const { name, host } = getMockName(to)
        this.ports[name] = this.ports[name] ?? hostPortNumber(host)
        this.mocks[name] = host
        return `http://web-mock-server:${this.ports[name]}`
      } else {
        return to
      }
    }
  }
}
