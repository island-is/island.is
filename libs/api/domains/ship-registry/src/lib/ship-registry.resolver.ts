import { Args, Query, Resolver } from '@nestjs/graphql'
import { ShipSearch } from './models/ship-search.model'
import { ShipSearchInput } from './dto/ship-search.input'
import { ShipRegistryClientService } from '@island.is/clients/ship-registry'

@Resolver()
export class ShipRegistryResolver {
  constructor(private readonly clientService: ShipRegistryClientService) {}

  @Query(() => ShipSearch, { name: 'shipRegistryShipSearch' })
  async shipSearch(@Args('input') input: ShipSearchInput): Promise<ShipSearch> {
    return Promise.resolve({
      ships: [],
      totalCount: 0,
    })
    //return this.service.findShipByNameOrNumber(input)
  }
}
