import { Query, Resolver } from '@nestjs/graphql'
import { UmsCostOfLivingCalculatorClientService } from '@island.is/clients/ums-cost-of-living-calculator'
import { CostOfLivingCalculatorResponse } from './models/costOfLivingCalculator.model'

import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }
@Resolver()
export class UmsCostOfLivingCalculatorResolver {
  constructor(
    private readonly service: UmsCostOfLivingCalculatorClientService,
  ) {}

  @Query(() => CostOfLivingCalculatorResponse, {
    name: 'costOfLivingCalculator',
    nullable: true,
  })
  @CacheControl(defaultCache)
  async getCalculatorData(): Promise<CostOfLivingCalculatorResponse> {
    const calculator = await this.service.getCalculatorData()
    return { items: calculator }
  }
}
