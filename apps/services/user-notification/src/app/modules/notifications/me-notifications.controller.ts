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
  Put,
  Delete,
} from '@nestjs/common'
import { Controller, Post, HttpCode } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { NotificationsScope } from '@island.is/auth/scopes'

import { NotificationsService } from './notifications.service'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments/environment'
import { Documentation } from '@island.is/nest/swagger'
import { Notification } from './notification.model'

@Controller({
  path: 'me/notifications',
})
// @UseGuards(IdsUserGuard, ScopesGuard)
export class MeNotificationsController {
  constructor(
    // @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly notificationsService: NotificationsService,
  ) {}

  // @Get('')
  // @Documentation({
  //   summary: 'Returns a cursor based paginated list of notifications for the current user',
  // })
  // @Scopes(NotificationsScope.read)
  // @ApiSecurity('oauth2', [NotificationsScope.read])
  // @ApiTags('user notification')
  // @Version('1')
  // async findAll(@Query('cursor') cursor: number): Promise<any> {
  //   return this.notificationsService.findAll(cursor)
  // }

  // @Get(':id')
  // @Documentation({
  //   summary: 'Returns a notification for the current user',
  // })
  // @Scopes(NotificationsScope.read)
  // @ApiSecurity('oauth2', [NotificationsScope.read])
  // @ApiTags('user notification')
  // @Version('1')
  // async findOne(@Param('id') id: number): Promise<Notification> {
  //   return this.notificationsService.findOne(id)
  // }


  



  // @Patch(':id')
  // @Documentation({
  //   summary: 'Updates a notification for the current user',
  // })
  // @Scopes(NotificationsScope.write)
  // @ApiSecurity('oauth2', [NotificationsScope.write])
  // @ApiTags('user notification')
  // @Version('1')
  // async update(@Param('id') id: number): Promise<Notification> {
  //   return this.notificationsService.update(id)
  // }

  @Post()
  create(@Body() notification: Partial<Notification>) {
    return this.notificationsService.create(notification);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() notification: Partial<Notification>) {
  //   return this.notificationsService.update(+id, notification);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
