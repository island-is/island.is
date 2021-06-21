import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { PaymentAPI } from '@island.is/clients/payment'
import { PaymentCatalogResponse } from './models/index'
import { PaymentCatalogInput } from './dto/paymentCatalogInput.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentAPI) {}

  @Query(() => PaymentCatalogResponse)
  async paymentCatalog(
    @Args('input', { type: () => PaymentCatalogInput }) input: PaymentCatalogInput,
  ): Promise<PaymentCatalogResponse> {
    console.log('inside api domains resolver')
    const data = await (input.performingOrganizationID
      ? this.paymentService.getCatalogByPerformingOrg(input.performingOrganizationID)
      : await this.paymentService.getCatalog())

    return {
      items: data.item,
    }
  }
}
