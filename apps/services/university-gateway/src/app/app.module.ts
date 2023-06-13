import { Module } from '@nestjs/common'
import { ApplicationModule } from './modules/application/application.module'
import { CourseModule } from './modules/course/course.module'
import { MajorModule } from './modules/major/major.module'
import { UniversityModule } from './modules/university/university.module'
import { ExampleModule } from './modules/example/example.module'

@Module({
  imports: [
    ApplicationModule,
    CourseModule,
    MajorModule,
    UniversityModule,
    ExampleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
