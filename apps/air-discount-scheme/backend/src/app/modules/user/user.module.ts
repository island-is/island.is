import { Module } from '@nestjs/common'

import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

import { CacheModule } from '../cache'
import { DiscountModule } from '../discount'
import { FlightModule } from '../flight'
import { NationalRegistryModule } from '../nationalRegistry'

import { PrivateUserController,PublicUserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [
    DiscountModule,
    FlightModule,
    NationalRegistryModule,
    NationalRegistryClientModule,
    CacheModule,
  ],
  controllers: [PublicUserController, PrivateUserController],
  providers: [UserService],
})
export class UserModule {}
