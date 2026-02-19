import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
  ZendeskService,
  ZendeskServiceConfig,
} from '@island.is/clients/zendesk'
import type { ConfigType } from '@island.is/nest/config'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'

import { SharedTemplateAPIModule } from '../../../shared'

import { CoursesService } from './courses.service'
import { HHCoursesConfig } from './courses.config'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationApiCoreModule,
    ConfigModule.forRoot({
      load: [HHCoursesConfig],
    }),
  ],
  providers: [
    CoursesService,
    ZendeskService,
    {
      provide: ZendeskServiceConfig.KEY,
      useFactory: (config: ConfigType<typeof HHCoursesConfig>) => ({
        subdomain: config.zendeskSubdomain,
        formEmail: config.zendeskFormEmail,
        formToken: config.zendeskFormToken,
      }),
      inject: [HHCoursesConfig.KEY],
    },
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
