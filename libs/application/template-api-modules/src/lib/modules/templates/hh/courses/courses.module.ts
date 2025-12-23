import { Module } from '@nestjs/common'
import { ZendeskModule } from '@island.is/clients/zendesk'

import { SharedTemplateAPIModule } from '../../../shared'

import { CoursesService } from './courses.service'

@Module({
  imports: [SharedTemplateAPIModule, ZendeskModule],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
