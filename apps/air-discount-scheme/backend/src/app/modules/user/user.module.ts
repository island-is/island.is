import { Module } from '@nestjs/common'
import { PublicUserController, PrivateUserController } from './user.controller'
import { UserService } from './user.service'
import { DiscountModule } from '../discount'
import { FlightModule } from '../flight'
import { NationalRegistryModule } from '../nationalRegistry'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

@Module({
  imports: [
    DiscountModule,
    FlightModule,
    NationalRegistryModule,
    NationalRegistryClientModule,
  ],
  controllers: [PublicUserController, PrivateUserController],
  providers: [UserService],
})
export class UserModule {}
