import { Query, Resolver, Args } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { Fjarsysla } from './models'
import { FjarsyslaService } from './models/fjarsysla.service'
import { Authorize } from '../auth'

@Resolver(() => Fjarsysla)
export class FjarsyslaResolver {
  constructor(
    @Inject(FjarsyslaService)
    private fjarsyslaService: FjarsyslaService,
  ) {}

  @Authorize({ throwOnUnAuthorized: false })
  @Query(() => Boolean)
  async skilavottordFjarsyslaSkilagjald(
    @Args('nationalId') nid: string,
    @Args('vehiclePermno') permno: string,
  ): Promise<boolean> {
    return this.fjarsyslaService.getFjarsysluRest(nid, permno)
  }
}
