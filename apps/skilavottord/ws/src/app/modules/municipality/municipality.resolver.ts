import { Query, Resolver } from '@nestjs/graphql'

import { Authorize, Role } from '../auth'

import { MunicipalityModel } from './municipality.model'
import { MunicipalityService } from './municipality.service'

@Authorize()
@Resolver(() => MunicipalityModel)
export class MunicipalityResolver {
  constructor(private municipalityService: MunicipalityService) {}

  @Authorize({
    roles: [Role.developer, Role.recyclingFund, Role.municipality],
  })
  @Query(() => [MunicipalityModel], {
    name: 'skilavottordAllMunicipalities',
  })
  async skilavottordAllMunicipalities(): Promise<MunicipalityModel[]> {
    return this.municipalityService.findAll()
  }
}
