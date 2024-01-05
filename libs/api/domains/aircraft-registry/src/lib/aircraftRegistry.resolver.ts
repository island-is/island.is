import { Args, Query, Resolver } from '@nestjs/graphql'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import { AircraftRegistryService } from './aircraftRegistry.service'
import { AllAircraftsResponse } from './dto/allAircraftsResponse'
import { AllAircraftsInput } from './dto/allAircrafts.input'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@Resolver()
export class AircraftRegistryResolver {
  constructor(
    private readonly aircraftRegistryService: AircraftRegistryService,
  ) {}

  @CacheControl(defaultCache)
  @Query(() => AllAircraftsResponse, { name: 'aircraftRegistryAllAircrafts' })
  async allAircrafts(@Args('input') input: AllAircraftsInput) {
    return this.aircraftRegistryService.getAllAircrafts(
      input.pageNumber,
      input.pageSize,
      input.searchTerm,
    )
  }
}
