import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { Charge } from '@island.is/clients/payment'
import { PaymentAPI } from '@island.is/clients/payment'
import { CreatingPaymentModel, PaymentCatalogResponse } from './models/index'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentAPI) {}

  @Query(() => CreatingPaymentModel)
  createChargePayment(createChargeToClient: Charge) {
    return this.paymentService.createCharge(createChargeToClient)
  }

  @Query(() => PaymentCatalogResponse)
  paymentCatalog(): Promise<PaymentCatalogResponse> {
    return this.paymentService.getCatalog()
  }

  @Query(() => PaymentCatalogResponse)
  paymentCatalogPerformingOrg(
    @Args('performingOrganizationID') performingOrganizationID: string,
  ): Promise<PaymentCatalogResponse> {
    return this.paymentService.getCatalogByPerformingOrg(
      performingOrganizationID,
    )
  }
}
