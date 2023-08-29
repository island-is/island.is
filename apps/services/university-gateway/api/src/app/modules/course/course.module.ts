import { Module } from '@nestjs/common'
import { CourseResolver } from './course.resolver'
import {
  UgReykjavikUniversityClientModule,
  UgReykjavikUniversityClientConfig,
} from '@island.is/clients/university-gateway/reykjavik-university'
import { ConfigModule } from '@nestjs/config'

@Module({
  providers: [CourseResolver],
})

export class CourseModule {}
