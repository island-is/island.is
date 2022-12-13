import { ServiceDefinition, ServiceDefinitionCore } from './types/input-types'
import { EnvironmentConfig, ReferenceResolver } from './types/charts'

export class Kubernetes implements ReferenceResolver {
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
      return to
    }
  }
}
