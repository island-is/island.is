import { ServiceDefinition, ServiceDefinitionCore } from './types/input-types'
import { DeploymentRuntime, EnvironmentConfig } from './types/charts'
import { getMockName, hostPortNumber } from './mocks/mocks-support'

export class Kubernetes implements DeploymentRuntime {
  releaseName: string
  feature?: string
  deps: { [name: string]: Set<string> } = {}
  ports: { [name: string]: number } = {}
  mocks: { [name: string]: string } = {}

  constructor(env: EnvironmentConfig) {
    this.releaseName = env.releaseName
    this.feature = env.feature
  }

  ref(from: ServiceDefinitionCore, to: ServiceDefinition | string) {
    if (typeof to === 'object') {
      const dependecies = this.deps[to.name] ?? new Set<string>()
      this.deps[to.name] = dependecies.add(from.name)
      return from.namespace === to.namespace
        ? `${this.releaseName}-${to.name}`
        : `${this.releaseName}-${to.name}.${to.namespace}.svc.cluster.local`
    } else {
      if (this.feature) {
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
