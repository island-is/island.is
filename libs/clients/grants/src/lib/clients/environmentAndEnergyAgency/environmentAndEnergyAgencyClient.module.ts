import { Module } from '@nestjs/common'
import { EnvironmentAndEnergyAgencyClientService } from './environmentAndEnergyAgencyClient.service'

@Module({
  providers: [EnvironmentAndEnergyAgencyClientService],
  exports: [EnvironmentAndEnergyAgencyClientService],
})
export class EnvironmentAndEnergyAgencyClientModule {}
