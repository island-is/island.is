import {
  Resolver,
} from '@nestjs/graphql'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import {
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'

import { Application } from './models/application.model'

@UseGuards(JwtGraphQlAuthGuard)
  @Resolver(() => Application)
export class ApplicationResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) { }
}
