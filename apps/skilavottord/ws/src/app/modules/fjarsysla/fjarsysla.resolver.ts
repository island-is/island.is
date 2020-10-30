import { Query, Resolver, Args } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { Fjarsysla } from './models'
import { FjarsyslaService } from './models/fjarsysla.service'

@Resolver(() => Fjarsysla)
export class FjarsyslaResolver {
  constructor(
    @Inject(FjarsyslaService)
    private fjarsyslaService: FjarsyslaService,
  ) {}

  @Query(() => Fjarsysla)
  async skilavottordFjarsyslaSkilagjald(
    @Args('nationalId') nid: string,
    @Args('vehiclePermno') permno: string,
  ): Promise<Fjarsysla> {
    return this.fjarsyslaService.getFjarsysluRest(nid, permno)
  }
}
