import { Module } from '@nestjs/common'
import { DirectorateOfImmigrationClient } from './directorateOfImmigrationClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [DirectorateOfImmigrationClient, ...exportedApis],
  exports: [DirectorateOfImmigrationClient],
})
export class DirectorateOfImmigrationClientModule {}
