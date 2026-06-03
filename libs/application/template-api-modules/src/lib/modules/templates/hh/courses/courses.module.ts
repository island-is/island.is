import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import {
  ChargeFjsV2ClientModule,
  ChargeFjsV2ClientConfig,
} from '@island.is/clients/charge-fjs-v2'

import { SharedTemplateAPIModule } from '../../../shared'

import { CoursesService } from './courses.service'
import { HHCoursesConfig } from './courses.config'
import { ZendeskModule } from '@island.is/clients/zendesk'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationApiCoreModule,
    ConfigModule.forRoot({
      load: [HHCoursesConfig, ChargeFjsV2ClientConfig],
    }),
    ZendeskModule,
    ChargeFjsV2ClientModule,
  ],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
