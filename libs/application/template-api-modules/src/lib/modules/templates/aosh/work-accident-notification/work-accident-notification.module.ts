import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { WorkAccidentNotificationTemplateService } from './work-accident-notification.service'
import {
  WorkAccidentClientConfig,
  WorkAccidentClientModule,
} from '@island.is/clients/work-accident-ver'
import { ConfigModule } from '@nestjs/config'

export class WorkAccidentNotificationTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: WorkAccidentNotificationTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config), // TODO Remember this changed on main https://github.com/island-is/island.is/pull/15872
        WorkAccidentClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [WorkAccidentClientConfig],
        }),
      ],
      providers: [WorkAccidentNotificationTemplateService],
      exports: [WorkAccidentNotificationTemplateService],
    }
  }
}
