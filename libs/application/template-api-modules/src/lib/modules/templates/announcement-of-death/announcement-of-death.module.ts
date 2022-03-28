import { DynamicModule } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { AnnouncementOfDeathService } from './announcement-of-death.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'

export class AnnouncementOfDeathModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: AnnouncementOfDeathModule,
      imports: [
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
      ],
      providers: [AnnouncementOfDeathService],
      exports: [AnnouncementOfDeathService],
    }
  }
}
