import { Module } from '@nestjs/common'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { NationalRegistryService } from './national-registry.service'
import { AssetsModule } from '@island.is/api/domains/assets'
import { ConfigModule } from '@nestjs/config'
import { AssetsClientConfig } from '@island.is/clients/assets'
import { NationalRegistryV3ApplicationsClientModule } from '@island.is/clients/national-registry-v3-applications'

@Module({
  imports: [
    NationalRegistryClientModule,
    NationalRegistryV3ApplicationsClientModule,
    AssetsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AssetsClientConfig],
    }),
  ],
  providers: [NationalRegistryService],
  exports: [NationalRegistryService],
})
export class NationalRegistryModule {}
