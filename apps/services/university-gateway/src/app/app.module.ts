import { Module } from '@nestjs/common'
import { CourseModule } from './modules/course/course.module'
import { MajorModule } from './modules/major/major.module'
import { RegistrationModule } from './modules/registration/registration.module'

@Module({
  imports: [CourseModule, MajorModule, RegistrationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
