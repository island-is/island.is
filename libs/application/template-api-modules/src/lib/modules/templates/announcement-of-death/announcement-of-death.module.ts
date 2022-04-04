import { DynamicModule } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { AnnouncementOfDeathSubmissionService } from './announcement-of-death.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { NationalRegistryClientConfig, NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'

export class AnnouncementOfDeathSubmissionModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: AnnouncementOfDeathSubmissionModule,
      imports: [
        NationalRegistryClientModule,
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, NationalRegistryClientConfig],
        }),
      ],
      providers: [AnnouncementOfDeathSubmissionService],
      exports: [AnnouncementOfDeathSubmissionService],
    }
  }
}
