import { Resolver, Query, Args } from '@nestjs/graphql'
import { NationalRegistryXRoadService } from './national-registry-x-road.service'
import { CurrentUser, User } from '@island.is/auth-nest-tools'
import { NationalRegistry } from '@island.is/application/templates/family-matters-core/types'

@Resolver()
export class NationalRegistryXRoadResolver {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  @Query(() => String, { nullable: true })
  async getCustodyChildrenAndParents(
    @CurrentUser() user: User,
  ): Promise<NationalRegistry | undefined> {
    const bla = await this.nationalRegistryXRoadService.getCustodyChildrenAndParents(
      user.nationalId,
    )
    console.log('bla', bla)
    return bla
  }
}
