import { Resolver } from '@nestjs/graphql'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { JwtGraphQlAuthGuard } from '@island.is/judicial-system/auth'
import { Course } from './models/course.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Course)
export class CourseResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}
}
