import { Module } from '@nestjs/common'

import { PublicUserController, PrivateUserController } from './user.controller'
import { UserService } from './user.service'
import { DiscountModule } from '../discount'
import { FlightModule } from '../flight'
import { NationalRegistryModule as ADSNationalRegistryModule } from '../nationalRegistry'
//import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

@Module({
  imports: [
    DiscountModule,
    FlightModule,
    ADSNationalRegistryModule,
    //NationalRegistryClientModule,
    NationalRegistryXRoadModule,
  ],
  controllers: [PublicUserController, PrivateUserController],
  providers: [UserService],
})
export class UserModule {}
