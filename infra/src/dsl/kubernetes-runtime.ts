import { ServiceDefinition, ServiceDefinitionCore } from './types/input-types'
import { ReferenceResolver, EnvironmentConfig } from './types/charts'
import { getMockName, hostPortNumber } from './mocks/mocks-support'
import { Mocks } from './value-files-generators/helm-value-file'

export class Kubernetes implements ReferenceResolver {
  feature?: string
  deps: { [name: string]: Set<string> } = {}
  ports: { [name: string]: number } = {}
  mocks: { [name: string]: string } = {}

  withMocks: Mocks

  constructor(env: EnvironmentConfig, withMocks?: Mocks) {
    this.feature = env.feature
    this.withMocks = withMocks ?? 'no-mocks'
  }

  ref(from: ServiceDefinitionCore, to: ServiceDefinition | string) {
    if (typeof to === 'object') {
      const dependecies = this.deps[to.name] ?? new Set<string>()
      this.deps[to.name] = dependecies.add(from.name)
      return from.namespace === to.namespace
        ? `${to.name}`
        : `${to.name}.${to.namespace}.svc.cluster.local`
    } else {
      if (this.withMocks === 'with-mocks') {
        const { name, host } = getMockName(to)
        this.ports[name] = this.ports[name] ?? hostPortNumber(host)
        this.mocks[name] = host
        return `http://mock-server:${this.ports[name]}`
      } else {
        return to
      }
    }
  }
}
