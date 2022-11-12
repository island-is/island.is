import { ServiceDefinition, ServiceDefinitionCore } from './types/input-types'
import { DeploymentRuntime, EnvironmentConfig } from './types/charts'
import { createHash } from 'crypto'

const portsIndex = 9000

function portNumberFromHost(name: string) {
  return (
    portsIndex +
    (Number.parseInt(
      createHash('sha1').update(name, 'utf-8').digest('hex').slice(-3),
      16,
    ) %
      1000)
  )
}

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
      this.ports[to.name] = this.ports[to.name] ?? portNumberFromHost(to.name)
      const dependencies = this.deps[to.name] ?? new Set<string>()
      this.deps[to.name] = dependencies.add(from.name)
      return `localhost:${this.ports[to.name]}`
    } else {
      const { name, host } = this.getMockName(to)
      this.ports[name] = this.ports[name] ?? portNumberFromHost(host)
      const dependencies = this.mocks[name]
      this.mocks[name] = host
      return `http://localhost:${this.ports[name]}`
    }
  }

  private getMockName(to: string) {
    const parsed = new URL(to)
    parsed.pathname = ''
    return {
      name: `mock-${parsed.host.replace(/\./g, '-')}`,
      host: parsed.toString().slice(0, -1),
    }
  }
}
