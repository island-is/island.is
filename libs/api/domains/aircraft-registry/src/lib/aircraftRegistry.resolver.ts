import { Query, Resolver } from '@nestjs/graphql'
import { AircraftRegistryApi } from '@island.is/clients/aircraft-registry'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@Resolver()
export class AircraftRegistryResolver {
  constructor(private readonly api: AircraftRegistryApi) {}

  @CacheControl(defaultCache)
  @Query(() => Number)
  async allAircrafts() {
    this.api.getAllAircraftsGet({})
  }
}
