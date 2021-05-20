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
import { CreatingPaymentModel } from './models/creatingPayment.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PaymentResolver {
  constructor(private PaymentService: PaymentService) {}

  @Query(() => [CreatingPaymentModel])
  async createChargePayment(createChargeToClient: Charge) {
    return this.PaymentService.createCharge(createChargeToClient)
  }

  @Query(() => [])
  async paymentCatalog() {
    return this.PaymentService.getCatalog()
  }
  
  @Query(() => [])
  async paymentCatalogPerformingOrg(thisOrganizationCatalog: string) {
    return this.PaymentService.getCatalogByPerformingOrg(thisOrganizationCatalog)
  }
}