import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { Charge } from '@island.is/clients/payment'
import { PaymentAPI } from '@island.is/clients/payment'
import { CreatingPaymentModel, PaymentCatalogResponse } from './models/index'

// MUST UNCOMMENT GUARDS - WORKAROUND FOR GRAPHQLQUERIES.
//@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PaymentResolver {
  constructor(private PaymentService: PaymentAPI) {}

  @Query(() => CreatingPaymentModel)
  createChargePayment(createChargeToClient: Charge) {
    return this.PaymentService.createCharge(createChargeToClient)
  }

  @Query(() => PaymentCatalogResponse)
  paymentCatalog(): Promise<PaymentCatalogResponse> {
    return this.PaymentService.getCatalog()
  }

  @Query(() => PaymentCatalogResponse)
  paymentCatalogPerformingOrg(
    @Args('performingOrganizationID') performingOrganizationID: string,
  ): Promise<PaymentCatalogResponse> {
    //console.log('resolver param: ' + performingOrganizationID)
    return this.PaymentService.getCatalogByPerformingOrg(
      performingOrganizationID,
    )
  }
}
