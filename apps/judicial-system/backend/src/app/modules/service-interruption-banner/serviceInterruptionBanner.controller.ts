import { Body, Controller, Get, Inject, Patch, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { adminRule } from '../../guards'
import { messageSuspensionManagerRule } from '../message-suspension/guards/rolesRules'
import { ServiceInterruptionBanner } from '../repository'
import { UpdateServiceInterruptionBannerDto } from './dto/updateServiceInterruptionBanner.dto'
import { ServiceInterruptionBannerService } from './serviceInterruptionBanner.service'

@Controller('api/service-interruption-banner')
@ApiTags('service interruption banner')
export class ServiceInterruptionBannerController {
  constructor(
    private readonly serviceInterruptionBannerService: ServiceInterruptionBannerService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(JwtAuthUserGuard)
  @Get()
  @ApiOkResponse({
    type: ServiceInterruptionBanner,
    description: 'Gets the service interruption banner settings',
  })
  get(): Promise<ServiceInterruptionBanner> {
    this.logger.debug('Getting service interruption banner settings')

    return this.serviceInterruptionBannerService.get()
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @RolesRules(adminRule, messageSuspensionManagerRule)
  @Patch()
  @ApiOkResponse({
    type: ServiceInterruptionBanner,
    description: 'Updates the service interruption banner settings',
  })
  update(
    @CurrentHttpUser() user: User,
    @Body() update: UpdateServiceInterruptionBannerDto,
  ): Promise<ServiceInterruptionBanner> {
    this.logger.debug('Updating service interruption banner settings')

    return this.serviceInterruptionBannerService.update(update, user.nationalId)
  }
}
