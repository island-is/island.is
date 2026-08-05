import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { PaymentCatalogResponse } from './models/index'
import { PaymentCatalogInput } from './dto/paymentCatalogInput.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PaymentResolver {
  constructor(private chargeFjsV2ClientService: ChargeFjsV2ClientService) {}

  @Query(() => PaymentCatalogResponse)
  async paymentCatalog(
    @Args('input', { type: () => PaymentCatalogInput })
    input: PaymentCatalogInput,
  ): Promise<PaymentCatalogResponse> {
    if (!input?.performingOrganizationID) {
      throw Error('Missing performing organization ID')
    }

    const data = await this.chargeFjsV2ClientService.getCatalogByPerformingOrg({
      performingOrgID: input.performingOrganizationID,
    })

    return {
      items: data.item,
    }
  }
}
