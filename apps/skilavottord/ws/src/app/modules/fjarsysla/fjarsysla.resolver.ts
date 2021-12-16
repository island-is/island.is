import { UseGuards } from '@nestjs/common'
import { Query, Resolver, Args } from '@nestjs/graphql'

import { IdsUserGuard, CurrentUser, User } from '@island.is/auth-nest-tools'

import { Fjarsysla } from './fjarsysla.model'
import { FjarsyslaService } from './fjarsysla.service'

@UseGuards(IdsUserGuard)
@Resolver(() => Fjarsysla)
export class FjarsyslaResolver {
  constructor(private fjarsyslaService: FjarsyslaService) {}

  // @Authorize({ roles: [Role.developer, Role.recyclingCompany] })
  @Query(() => Boolean)
  async skilavottordFjarsyslaSkilagjald(
    @CurrentUser() user: User,
    @Args('vehiclePermno') permno: string,
    @Args('guid') id: string,
  ): Promise<boolean> {
    return this.fjarsyslaService.getFjarsysluRest(user.nationalId, permno, id)
  }
}
