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
      const mockName1 = this.getMockName(to)
      const mockName = mockName1.url.replace('http://', '')
      this.ports[mockName] =
        this.ports[mockName] ?? portNumberFromHost(mockName1.host)
      const dependencies = this.mocks[mockName]
      this.mocks[mockName] = mockName1.url
      return `http://localhost:${this.ports[mockName]}`
    }
  }

  private getMockName(to: string) {
    const parsed = new URL(to)
    parsed.protocol = 'http:'
    parsed.host = `mock-${parsed.host.replace(/\./g, '-')}`
    return {
      url: parsed.href.slice(
        0,
        parsed.href.length - (to.endsWith('/') ? 0 : 1),
      ),
      host: parsed.host,
    }
  }
}
