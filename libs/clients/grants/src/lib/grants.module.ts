import { Module } from '@nestjs/common'
import { GrantsClientService } from './grant.service'
import { RannisGrantsClientModule } from './clients/rannis/rannisGrants.module'
import { EnvironmentAndEnergyAgencyClientModule } from './clients/environmentAndEnergyAgency/environmentAndEnergyAgencyClient.module'

@Module({
  imports: [RannisGrantsClientModule, EnvironmentAndEnergyAgencyClientModule],
  providers: [GrantsClientService],
  exports: [GrantsClientService],
})
export class GrantsClientModule {}
