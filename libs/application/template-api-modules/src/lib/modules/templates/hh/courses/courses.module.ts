import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { CoursesService } from './courses.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
