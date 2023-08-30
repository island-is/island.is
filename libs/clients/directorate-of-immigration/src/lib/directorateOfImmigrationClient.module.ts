import { Module } from '@nestjs/common'
import { DirectorateOfImmigrationClient } from './directorateOfImmigrationClient.service'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'

@Module({
  providers: [
    ApiConfiguration,
    DirectorateOfImmigrationClient,
    ...exportedApis,
  ],
  exports: [DirectorateOfImmigrationClient],
})
export class DirectorateOfImmigrationClientModule {}
