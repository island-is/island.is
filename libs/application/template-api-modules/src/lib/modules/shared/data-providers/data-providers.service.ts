import { Injectable } from '@nestjs/common'
import { NationalRegistryService } from './national-registry/national-registry.service'
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
    /* type ObjectKey = keyof typeof this

    const service = (this[
      namespace as ObjectKey
    ] as unknown) as SharedServiceType

    if (!service) {
      throw new Error(`Service with the namespace : ${namespace} not found`)
    }
*/
    if (namespace === 'NationalRegistry') {
      return this.nationalRegistry
    } else if (namespace === 'UserProfile') {
      return this.userProfileService
    }
    throw new Error(`Service with the namespace : ${namespace} not found`)
  }
}
