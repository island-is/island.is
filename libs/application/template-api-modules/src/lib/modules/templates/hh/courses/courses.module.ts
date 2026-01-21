import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ZendeskModule } from '@island.is/clients/zendesk'
import { ApplicationApiCoreModule, Application } from '@island.is/application/api/core'

import { SharedTemplateAPIModule } from '../../../shared'

import { CoursesService } from './courses.service'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ZendeskModule,
    ApplicationApiCoreModule,
    SequelizeModule.forFeature([Application]),
  ],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
