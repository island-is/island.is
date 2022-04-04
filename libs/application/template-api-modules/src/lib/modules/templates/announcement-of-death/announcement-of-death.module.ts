import { DynamicModule } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { AnnouncementOfDeathService } from './announcement-of-death.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { NationalRegistryClientConfig, NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'

export class AnnouncementOfDeathModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: AnnouncementOfDeathModule,
      imports: [
        NationalRegistryClientModule,
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, NationalRegistryClientConfig],
        }),
      ],
      providers: [AnnouncementOfDeathService],
      exports: [AnnouncementOfDeathService],
    }
  }
}
