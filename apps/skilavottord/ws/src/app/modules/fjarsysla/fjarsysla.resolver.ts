import { Args,Query, Resolver } from '@nestjs/graphql'

import { Authorize, CurrentUser, Role,User } from '../auth'

import { Fjarsysla } from './fjarsysla.model'
import { FjarsyslaService } from './fjarsysla.service'

@Authorize({ roles: [Role.developer, Role.recyclingCompany] })
@Resolver(() => Fjarsysla)
export class FjarsyslaResolver {
  constructor(private fjarsyslaService: FjarsyslaService) {}

  @Query(() => Boolean)
  async skilavottordFjarsyslaSkilagjald(
    @CurrentUser() user: User,
    @Args('vehiclePermno') permno: string,
    @Args('guid') id: string,
  ): Promise<boolean> {
    return this.fjarsyslaService.getFjarsysluRest(user.nationalId, permno, id)
  }
}
