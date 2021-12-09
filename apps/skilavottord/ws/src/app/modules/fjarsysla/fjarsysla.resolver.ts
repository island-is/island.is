import { Query, Resolver, Args } from '@nestjs/graphql'

import { Authorize, Role, CurrentUser } from '../auth'
import type { AuthUser } from '../auth'
import { Fjarsysla } from './fjarsysla.model'
import { FjarsyslaService } from './fjarsysla.service'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => Fjarsysla)
export class FjarsyslaResolver {
  constructor(private fjarsyslaService: FjarsyslaService) {}

  @Authorize({ roles: [Role.developer, Role.recyclingCompany] })
  @Query(() => Boolean)
  async skilavottordFjarsyslaSkilagjald(
    @CurrentUser() user: AuthUser,
    @Args('vehiclePermno') permno: string,
    @Args('guid') id: string,
  ): Promise<boolean> {
    return this.fjarsyslaService.getFjarsysluRest(user.nationalId, permno, id)
  }
}
