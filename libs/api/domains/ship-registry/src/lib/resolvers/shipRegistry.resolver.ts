import { Args, Query, Resolver } from '@nestjs/graphql'
import { ShipRegistryClientService } from '@island.is/clients/ship-registry'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { ShipSearch } from '../models/ship-search.model'
import { ShipSearchInput } from '../dto/ship-search.input'

@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver(() => ShipSearch)
export class ShipRegistryResolver {
  constructor(private readonly service: ShipRegistryClientService) {}

  @Query(() => ShipSearch, { name: 'shipRegistryShipSearch', nullable: true })
  async shipSearch(@Args('input') input: ShipSearchInput): Promise<ShipSearch> {
    return this.service.findShipByNameOrNumber(input)
  }
}
