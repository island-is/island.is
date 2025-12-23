import { Injectable } from '@nestjs/common'
import { GrantBase } from './grant.types'
import { RannisGrantsClientService } from './clients/rannis/rannisGrants.service'
import { EnvironmentAndEnergyAgencyClientService } from './clients/environmentAndEnergyAgency/environmentAndEnergyAgencyClient.service'
import { EnergyGrantCollectionDto } from './clients/environmentAndEnergyAgency/dtos/eneryGrantCollection.dto'

@Injectable()
export class GrantsClientService {
  constructor(
    private readonly rannisGrantService: RannisGrantsClientService,
    private readonly energyGrantService: EnvironmentAndEnergyAgencyClientService,
  ) {}

  getGrants(): Promise<Array<GrantBase>> {
    return this.rannisGrantService.getGrants()
  }

  getEnergyGrants(): Promise<EnergyGrantCollectionDto | null> {
    return this.energyGrantService.getEnergyFundGrants()
  }
}
