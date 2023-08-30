import {
  Resolver,
} from '@nestjs/graphql'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import {
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'

import { Program } from './models/program.model'

@UseGuards(JwtGraphQlAuthGuard)
  @Resolver(() => Program)
export class ProgramResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) { }
}
