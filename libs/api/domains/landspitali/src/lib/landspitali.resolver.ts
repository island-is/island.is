import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'

import { CacheControl, type CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'

import { LandspitaliService } from './landspitali.service'
import { CreateMemorialCardPaymentUrlInput } from './dto/createMemorialCardPaymentUrl.input'
import { CreateMemorialCardPaymentUrlResponse } from './dto/createMemorialCardPaymentUrl.response'
import { CreateDirectGrantPaymentUrlInput } from './dto/createDirectGrantPaymentUrl.input'
import { CreateDirectGrantPaymentUrlResponse } from './dto/createDirectGrantPaymentUrl.response'
import { Catalog } from './dto/catalog.response'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@Resolver()
export class LandspitaliResolver {
  constructor(private readonly landspitaliService: LandspitaliService) {}

  @Mutation(() => CreateMemorialCardPaymentUrlResponse, {
    name: 'webLandspitaliMemorialCardPaymentUrl',
  })
  async createMemorialCardPaymentUrl(
    @Args('input') input: CreateMemorialCardPaymentUrlInput,
  ): Promise<CreateMemorialCardPaymentUrlResponse> {
    return this.landspitaliService.createMemorialCardPaymentUrl(input)
  }

  @Mutation(() => CreateDirectGrantPaymentUrlResponse, {
    name: 'webLandspitaliDirectGrantPaymentUrl',
  })
  async createDirectGrantPaymentUrl(
    @Args('input') input: CreateDirectGrantPaymentUrlInput,
  ): Promise<CreateDirectGrantPaymentUrlResponse> {
    return this.landspitaliService.createDirectGrantPaymentUrl(input)
  }

  @CacheControl(defaultCache)
  @Query(() => Catalog, {
    name: 'webLandspitaliCatalog',
  })
  async getCatalog(): Promise<Catalog> {
    return this.landspitaliService.getCatalog()
  }
}
