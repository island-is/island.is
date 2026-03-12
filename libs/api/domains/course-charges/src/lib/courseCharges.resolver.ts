import { Args, Query, Resolver } from '@nestjs/graphql'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'

import { CourseChargesService } from './courseCharges.service'
import { GetChargeItemCodesByCourseIdInput } from './dto/getChargeItemCodesByCourseId.input'
import { ChargeItemCodeByCourseIdResponse } from './models/chargeItemCodeByCourseId.model'
import { GetCourseAvailabilityInput } from './dto/getCourseAvailability.input'
import { CourseAvailabilityResponse } from './models/courseAvailability.model'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }
const availabilityCache: CacheControlOptions = { maxAge: 300 }

@Resolver()
export class CourseChargesResolver {
  constructor(private readonly courseChargesService: CourseChargesService) {}

  @CacheControl(defaultCache)
  @Query(() => ChargeItemCodeByCourseIdResponse)
  getChargeItemCodesByCourseId(
    @Args('input') input: GetChargeItemCodesByCourseIdInput,
  ): Promise<ChargeItemCodeByCourseIdResponse> {
    return this.courseChargesService.getChargeItemCodesByCourseId(input)
  }

  @CacheControl(availabilityCache)
  @Query(() => CourseAvailabilityResponse)
  getCourseAvailability(
    @Args('input') input: GetCourseAvailabilityInput,
  ): Promise<CourseAvailabilityResponse> {
    return this.courseChargesService.getCourseAvailability(input)
  }
}
