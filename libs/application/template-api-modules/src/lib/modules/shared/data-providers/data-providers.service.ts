import { Injectable } from '@nestjs/common'
import { NationalRegistryService } from './national-registry/national-registry.service'
import { SharedDataProviders } from '@island.is/application/core'

export type SharedServiceType = NationalRegistryService

@Injectable()
export class SharedDataProviderService {
  constructor(private readonly nationalRegistry: NationalRegistryService) {}

  getProvider(namespace: string): SharedServiceType {
    switch (namespace) {
      case SharedDataProviders.nationalRegistryProvider.namespace:
        return this.nationalRegistry

      default:
        throw new Error(`Service with the namespace : ${namespace} not found`)
    }
  }
}
