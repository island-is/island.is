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
import { CreatingPaymentModel, GettingPaymentCatalogOrg, GettingPaymentCatalog } from './graphql-models/index'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PaymentResolver {
  constructor(private PaymentService: PaymentService) {}

  @Query(() => [CreatingPaymentModel])
  createChargePayment(createChargeToClient: Charge) {
    return this.PaymentService.createCharge(createChargeToClient)
  }

  @Query(() => [GettingPaymentCatalog])
  paymentCatalog() {
    return this.PaymentService.getCatalog()
  }
  
  @Query(() => GettingPaymentCatalogOrg)
  paymentCatalogPerformingOrg(thisOrganizationCatalog: string) {
    return this.PaymentService.getCatalogByPerformingOrg(thisOrganizationCatalog)
  }
}