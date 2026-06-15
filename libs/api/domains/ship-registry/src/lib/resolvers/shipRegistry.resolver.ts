import { Args, Query, Resolver } from '@nestjs/graphql'
import { ShipRegistryClientService } from '@island.is/clients/ship-registry'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { LocaleEnum } from '@island.is/nest/graphql'
import { ShipSearch } from '../models/ship-search.model'
import { ShipSearchInput } from '../dto/ship-search.input'
import { ShipRegistryRank } from '../models/rank.model'
import { SailorsService } from '../services/sailors.service'

@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver(() => ShipSearch)
export class ShipRegistryResolver {
  constructor(
    private readonly service: ShipRegistryClientService,
    private readonly sailorsService: SailorsService,
  ) {}

  @Query(() => ShipSearch, { name: 'shipRegistryShipSearch' })
  async shipSearch(@Args('input') input: ShipSearchInput): Promise<ShipSearch> {
    return this.service.findShipByNameOrNumber(input)
  }

  @Query(() => [ShipRegistryRank], {
    name: 'shipRegistryRanks',
    nullable: true,
  })
  async shipRegistryRanks(
    @Args('locale', {
      type: () => LocaleEnum,
      nullable: true,
      defaultValue: LocaleEnum.Is,
    })
    locale: LocaleEnum,
  ): Promise<ShipRegistryRank[]> {
    return this.sailorsService.getRanks(locale)
  }
}
