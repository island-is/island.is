import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ConfigModule } from '@nestjs/config'
import { WorkAccidentNotificationTemplateService } from './work-accident-notification.service'

export class WorkAccidentNotificationTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: WorkAccidentNotificationTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [],
        }),
      ],
      providers: [WorkAccidentNotificationTemplateService],
      exports: [WorkAccidentNotificationTemplateService],
    }
  }
}
