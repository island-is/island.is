import { Injectable } from '@nestjs/common'
import { NationalRegistryService } from './national-registry/national-registry.service'
import { SharedDataProviders } from '@island.is/application/core'
import { UserProfileService } from './user-profile/user-profile.service'
import { PaymentCatalogService } from './payment-catalog/payment-catalog.service'

export type SharedServiceType =
  | NationalRegistryService
  | UserProfileService
  | PaymentCatalogService

@Injectable()
export class SharedDataProviderService {
  constructor(
    private readonly nationalRegistry: NationalRegistryService,
    private readonly userProfileService: UserProfileService,
    private readonly paymentCatalogService: PaymentCatalogService,
  ) {}

  getProvider(namespace: string): SharedServiceType {
    switch (namespace) {
      case SharedDataProviders.nationalRegistryProvider.namespace:
        return this.nationalRegistry
      case SharedDataProviders.userProfileProvider.namespace:
        return this.userProfileService
      case SharedDataProviders.paymentCatalogProvider.namespace:
        return this.paymentCatalogService

      default:
        throw new Error(`Service with the namespace : ${namespace} not found`)
    }
  }
}
