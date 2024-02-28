import { Query, Resolver } from '@nestjs/graphql'
import { AdministrationOfOccupationalSafetyAndHealthClientService } from '@island.is/clients/administration-of-occupational-safety-and-health'
import { CoursesResponse } from './models/course.model'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }
@Resolver()
export class AdministrationOfOccupationalSafetyAndHealthResolver {
  constructor(
    private readonly service: AdministrationOfOccupationalSafetyAndHealthClientService,
  ) {}

  @CacheControl(defaultCache)
  @Query(() => CoursesResponse, {
    name: 'administrationOfOccupationalSafetyAndHealthCourses',
  })
  async courses(): Promise<CoursesResponse> {
    const courses = await this.service.getCourses()
    return { courses }
  }
}
