import { Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { JwtGraphQlAuthGuard } from '@island.is/judicial-system/auth'
import { University } from './models/university.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => University)
export class UniversityResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}
}
