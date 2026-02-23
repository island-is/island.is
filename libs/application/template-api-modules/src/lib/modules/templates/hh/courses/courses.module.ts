import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
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
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
