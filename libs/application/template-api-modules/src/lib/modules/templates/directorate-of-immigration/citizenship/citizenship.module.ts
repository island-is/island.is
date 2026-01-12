import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { CitizenshipService } from './citizenship.service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import {
  DirectorateOfImmigrationClientModule,
  DirectorateOfImmigrationClientConfig,
} from '@island.is/clients/directorate-of-immigration'
import { NationalRegistryV3ApplicationsClientModule } from '@island.is/clients/national-registry-v3-applications'

@Module({
  imports: [
    SharedTemplateAPIModule,
    DirectorateOfImmigrationClientModule,
    NationalRegistryClientModule,
    NationalRegistryV3ApplicationsClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DirectorateOfImmigrationClientConfig],
    }),
  ],
  providers: [CitizenshipService],
  exports: [CitizenshipService],
})
export class CitizenshipModule {}
