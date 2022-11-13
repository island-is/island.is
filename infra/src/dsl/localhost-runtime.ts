import { ServiceDefinition, ServiceDefinitionCore } from './types/input-types'
import { DeploymentRuntime, EnvironmentConfig } from './types/charts'
import { getMockName, hostPortNumber } from './mocks/mocks-support'

export class Localhost implements DeploymentRuntime {
  env: EnvironmentConfig // TODO: get rid of this?
  constructor(env: EnvironmentConfig) {
    this.env = env
  }

  deps: { [name: string]: Set<string> } = {}
  ports: { [name: string]: number } = {}
  mocks: { [name: string]: string } = {}

  ref(from: ServiceDefinitionCore, to: ServiceDefinition | string) {
    if (typeof to === 'object') {
      this.ports[to.name] = this.ports[to.name] ?? hostPortNumber(to.name)
      const dependencies = this.deps[to.name] ?? new Set<string>()
      this.deps[to.name] = dependencies.add(from.name)
      return `localhost:${this.ports[to.name]}`
    } else {
      const { name, host } = getMockName(to)
      this.ports[name] = this.ports[name] ?? hostPortNumber(host)
      this.mocks[name] = host
      return `http://localhost:${this.ports[name]}`
    }
  }
}
