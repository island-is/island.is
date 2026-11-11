import { Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthUserGuard,
} from '@island.is/judicial-system/auth'
import type { User as TUser } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { UpdateServiceInterruptionBannerInput } from './dto/updateServiceInterruptionBanner.input'
import { ServiceInterruptionBanner } from './models/serviceInterruptionBanner.model'

@Resolver(() => ServiceInterruptionBanner)
export class ServiceInterruptionBannerResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
  ) {}

  @UseGuards(JwtGraphQlAuthUserGuard)
  @Query(() => ServiceInterruptionBanner, { nullable: true })
  serviceInterruptionBanner(
    @CurrentGraphQlUser() user: TUser,
  ): Promise<ServiceInterruptionBanner> {
    this.logger.debug('Getting service interruption banner settings')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_SERVICE_INTERRUPTION_BANNER,
      this.backendService.getServiceInterruptionBanner(),
      () => 'service-interruption-banner',
    )
  }

  @UseGuards(JwtGraphQlAuthUserGuard)
  @Mutation(() => ServiceInterruptionBanner, { nullable: true })
  updateServiceInterruptionBanner(
    @Args('input', { type: () => UpdateServiceInterruptionBannerInput })
    input: UpdateServiceInterruptionBannerInput,
    @CurrentGraphQlUser() user: TUser,
  ): Promise<ServiceInterruptionBanner> {
    this.logger.debug('Updating service interruption banner settings')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_SERVICE_INTERRUPTION_BANNER,
      this.backendService.updateServiceInterruptionBanner(input),
      () => 'service-interruption-banner',
    )
  }
}
