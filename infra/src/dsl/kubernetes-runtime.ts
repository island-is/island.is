import { ServiceDefinition, ServiceDefinitionCore } from './types/input-types'
import { ReferenceResolver, EnvironmentConfig } from './types/charts'
import { getMockName, hostPortNumber } from './mocks/mocks-support'
import { Mocks } from './value-files-generators/helm-value-file'

export class Kubernetes implements ReferenceResolver {
  releaseName: string
  feature?: string
  deps: { [name: string]: Set<string> } = {}
  ports: { [name: string]: number } = {}
  mocks: { [name: string]: string } = {}

  withMocks: Mocks

  constructor(env: EnvironmentConfig, withMocks?: Mocks) {
    this.releaseName = env.releaseName
    this.feature = env.feature
    this.withMocks = withMocks ?? 'no-mocks'
  }

  ref(from: ServiceDefinitionCore, to: ServiceDefinition | string) {
    if (typeof to === 'object') {
      const dependecies = this.deps[to.name] ?? new Set<string>()
      this.deps[to.name] = dependecies.add(from.name)

      // TODO: temp hack to exclude judicial system
      if (this.releaseName === '' && !from.name.includes('judicial')) {
        return from.namespace === to.namespace || this.feature != undefined
          ? `${to.name}`
          : `${to.name}.${to.namespace}.svc.cluster.local`
      } else {
        if (this.releaseName === '') {
          return from.namespace === to.namespace || this.feature != undefined
            ? `web-${to.name}`
            : `web-${to.name}.${to.namespace}.svc.cluster.local`
        } else {
          return from.namespace === to.namespace || this.feature != undefined
            ? `${this.releaseName}-${to.name}`
            : `${this.releaseName}-${to.name}.${to.namespace}.svc.cluster.local`
        }
      }
    } else {
      if (this.withMocks === 'with-mocks') {
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
