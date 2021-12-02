import { Query, Resolver, Args } from '@nestjs/graphql'

import { Authorize } from '../auth'
import { Fjarsysla } from './fjarsysla.model'
import { FjarsyslaService } from './fjarsysla.service'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => Fjarsysla)
export class FjarsyslaResolver {
  constructor(private fjarsyslaService: FjarsyslaService) {}

  /*
    Use by recyclingCompany to pay customer when they get vehicle
  */
  @Authorize({ roles: ['developer', 'recyclingCompany'] })
  @Query(() => Boolean)
  async skilavottordFjarsyslaSkilagjald(
    @Args('nationalId') nid: string,
    @Args('vehiclePermno') permno: string,
    @Args('guid') id: string,
  ): Promise<boolean> {
    return this.fjarsyslaService.getFjarsysluRest(nid, permno, id)
  }
}
