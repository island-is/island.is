import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ZendeskModule } from '@island.is/clients/zendesk'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'

import { SharedTemplateAPIModule } from '../../../shared'

import { CoursesService } from './courses.service'
import { HHCoursesConfig } from './courses.config'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ZendeskModule,
    ApplicationApiCoreModule,
    ConfigModule.forRoot({
      load: [HHCoursesConfig],
    }),
  ],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
