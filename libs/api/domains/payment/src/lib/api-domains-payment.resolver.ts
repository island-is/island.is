import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { PaymentAPI } from '@island.is/clients/payment'
import { PaymentCatalogResponse } from './models/index'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentAPI) {}

  @Query(() => PaymentCatalogResponse)
  paymentCatalog(
    @Args('performingOrganizationID') performingOrganizationID?: string,
  ): Promise<PaymentCatalogResponse> {
    if(performingOrganizationID) {
      return this.paymentService.getCatalogByPerformingOrg(
        performingOrganizationID,
      )
    } else {
      return this.paymentService.getCatalog()
    }
  }
}
