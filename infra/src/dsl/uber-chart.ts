import { Service } from './types/input-types'
import { EnvironmentConfig, UberChartType } from './types/charts'

export class UberChart implements UberChartType {
  env: EnvironmentConfig

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
      return this.env.feature ? `mock-${serviceReference}` : serviceReference
    } else {
      const dependecies = this.deps[to] ?? new Set<Service>()
      this.deps[to] = dependecies.add(from)
      return this.env.feature ? `mock-${to}` : to
    }
  }
}
