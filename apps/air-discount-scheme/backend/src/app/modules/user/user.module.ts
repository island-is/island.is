import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { FlightModule } from '../flight'
import { NationalRegistryModule } from '../nationalRegistry'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { CacheModule } from '../cache'
import { PrivateUserController } from './user.controller'

@Module({
  imports: [
    FlightModule,
    NationalRegistryModule,
    NationalRegistryClientModule,
    CacheModule,
  ],
  controllers: [PrivateUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
