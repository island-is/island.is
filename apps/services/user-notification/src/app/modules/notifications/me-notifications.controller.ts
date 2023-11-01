import {
  Inject,
  Body,
  Get,
  Param,
  Query,
  UseInterceptors,
  BadRequestException,
  Version,
  VERSION_NEUTRAL,
  UseGuards,
  Patch,
} from '@nestjs/common'
import { Controller, Post, HttpCode } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { NotificationsScope } from '@island.is/auth/scopes'

import { NotificationsService } from './notifications.service'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments/environment'

@Controller({
  path: 'me/notifications',
})
// @UseGuards(IdsUserGuard, ScopesGuard)
export class MeNotificationsController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get('')
  @Scopes(NotificationsScope.read)
  @ApiSecurity('oauth2', [NotificationsScope.read])
  @ApiTags('user notification')
  @Version('1')
  findAll(@Query('cursor') cursor: number): any {
    // async
    // console.log(environment)
    // console.log(process.env)
    return process.env
    return this.notificationsService.findAll(cursor)
  }

  @Get(':id')
  @Scopes(NotificationsScope.read)
  @ApiSecurity('oauth2', [NotificationsScope.read])
  @ApiTags('user notification')
  @Version('1')
  findOne(@Param('id') id: number): Promise<Notification> {
    return this.notificationsService.findOne(id)
  }

  @Patch(':id')
  @Scopes(NotificationsScope.write)
  @ApiSecurity('oauth2', [NotificationsScope.write])
  @ApiTags('user notification')
  @Version('1')
  update(@Param('id') id: number): Promise<Notification> {
    return this.notificationsService.update(id)
  }
}
