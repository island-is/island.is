import { Module } from '@nestjs/common'
import {
  ZendeskService,
  ZendeskServiceConfig,
} from '@island.is/clients/zendesk'
import { ConfigModule, type ConfigType } from '@island.is/nest/config'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { SharedTemplateAPIModule } from '../../../shared'

import { CoursesService } from './courses.service'
import { HHCoursesConfig } from './courses.config'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationApiCoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [HHCoursesConfig],
    }),
  ],
  providers: [
    CoursesService,
    {
      provide: ZendeskService,
      useFactory: (
        config: ConfigType<typeof HHCoursesConfig>,
        logger: Logger,
      ) =>
        new ZendeskService(
          {
            subdomain: config.zendeskSubdomain,
            formEmail: config.zendeskFormTokenEmail,
            formToken: config.zendeskFormToken,
          } as ConfigType<typeof ZendeskServiceConfig>,
          logger,
        ),
      inject: [HHCoursesConfig.KEY, LOGGER_PROVIDER],
    },
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
