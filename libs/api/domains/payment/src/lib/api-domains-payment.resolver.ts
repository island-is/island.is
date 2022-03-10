import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { PaymentAPI } from '@island.is/clients/payment'
import { PaymentCatalogResponse } from './models/index'
import { PaymentCatalogInput } from './dto/paymentCatalogInput.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PaymentResolver {
  constructor(private paymentClientApi: PaymentAPI) {}

  @Query(() => PaymentCatalogResponse)
  async paymentCatalog(
    @Args('input', { type: () => PaymentCatalogInput })
    input: PaymentCatalogInput,
  ): Promise<PaymentCatalogResponse> {
    const data = await (input.performingOrganizationID
      ? this.paymentClientApi.getCatalogByPerformingOrg(
          input.performingOrganizationID,
        )
      : await this.paymentClientApi.getCatalog())

    return {
      items: data.item,
    }
  }
}
