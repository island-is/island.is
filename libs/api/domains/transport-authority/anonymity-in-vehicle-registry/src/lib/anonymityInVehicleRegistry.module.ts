import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { AnonymityInVehicleRegistryApi } from './anonymityInVehicleRegistry.service'

@Module({
  imports: [],
  providers: [MainResolver, AnonymityInVehicleRegistryApi],
  exports: [AnonymityInVehicleRegistryApi],
})
export class AnonymityInVehicleRegistryApiModule {}
