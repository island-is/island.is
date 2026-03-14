import { Args, Query, Resolver } from '@nestjs/graphql'
import { ShipRegistryClientService } from '@island.is/clients/ship-registry'
import { ShipSearch } from '../models/ship-search.model'
import { ShipSearchInput } from '../dto/ship-search.input'

// Added opid field to ShipSearch model
@Resolver()
export class ShipRegistryResolver {
  constructor(private readonly service: ShipRegistryClientService) {}

  @Query(() => ShipSearch, { name: 'shipRegistryShipSearch' })
  async shipSearch(@Args('input') input: ShipSearchInput): Promise<ShipSearch> {
    return this.service.findShipByNameOrNumber(input)
  }
}
