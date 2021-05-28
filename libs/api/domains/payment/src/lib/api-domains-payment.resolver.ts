import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { Charge } from '@island.is/clients/payment'
import { PaymentService } from '@island.is/clients/payment'
import { CreatingPaymentModel, PaymentCatalogResponse } from './models/index'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PaymentResolver {
  constructor(private PaymentService: PaymentService) {}

  @Query(() => CreatingPaymentModel)
  createChargePayment(createChargeToClient: Charge) {
    return this.PaymentService.createCharge(createChargeToClient)
  }

  @Query(() => PaymentCatalogResponse)
  paymentCatalog(): Promise<PaymentCatalogResponse> {
    return this.PaymentService.getCatalog()
  }
  
  @Query(() => PaymentCatalogResponse)
  paymentCatalogPerformingOrg(thisOrganizationCatalog: string): Promise<PaymentCatalogResponse> {
    return this.PaymentService.getCatalogByPerformingOrg(thisOrganizationCatalog)
  }
}