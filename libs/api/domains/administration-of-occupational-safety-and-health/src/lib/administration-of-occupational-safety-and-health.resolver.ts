import { Query, Resolver } from '@nestjs/graphql'
import { AdministrationOfOccupationalSafetyAndHealthClientService } from '@island.is/clients/administration-of-occupational-safety-and-health'
import { CoursesResponse } from './models/course.model'

@Resolver()
export class AdministrationOfOccupationalSafetyAndHealthResolver {
  constructor(
    private readonly service: AdministrationOfOccupationalSafetyAndHealthClientService,
  ) {}

  @Query(() => CoursesResponse, {
    name: 'administrationOfOccupationalSafetyAndHealthCourses',
  })
  async courses(): Promise<CoursesResponse> {
    const courses = await this.service.getCourses()
    return { courses }
  }
}
