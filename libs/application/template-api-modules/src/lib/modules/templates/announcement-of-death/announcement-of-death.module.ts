import { Module } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { AnnouncementOfDeathService } from './announcement-of-death.service'
import { SharedTemplateAPIModule } from '../../shared'
import {
  NationalRegistryClientConfig,
  NationalRegistryClientModule,
} from '@island.is/clients/national-registry-v2'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'

@Module({
  imports: [
    NationalRegistryClientModule,
    SyslumennClientModule,
    SharedTemplateAPIModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, NationalRegistryClientConfig],
    }),
  ],
  providers: [AnnouncementOfDeathService],
  exports: [AnnouncementOfDeathService],
})
export class AnnouncementOfDeathModule {}
