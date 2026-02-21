import { Module } from '@nestjs/common'
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
    HHCoursesConfig.registerOptional(),
  ],
  providers: [
    CoursesService,
    ZendeskService,
    {
      provide: ZendeskServiceConfig.KEY,
      useFactory: (config: ConfigType<typeof HHCoursesConfig>) => {
        if (!config.isConfigured) {
          return { subdomain: '', formEmail: '', formToken: '' }
        }
        return {
          subdomain: config.zendeskSubdomain,
          formEmail: config.zendeskFormTokenEmail,
          formToken: config.zendeskFormToken,
        }
      },
      inject: [HHCoursesConfig.KEY],
    },
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
