import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  BadRequestException,
  ForbiddenException,
  ParseUUIDPipe,
} from '@nestjs/common'
import { UserNotificationsService } from './user-notifications.service'
import { CreateUserNotificationDto } from './dto/create-user-notification.dto'
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import {
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { UserProfileScope } from '@island.is/auth/scopes'
import { environment } from '../../environments'
import { Audit } from '@island.is/nest/audit'
import { UserNotificationDto } from './dto/user-notification.dto'

@Audit({
  namespace: `${environment.audit.defaultNamespace}/user-notifications`,
})
@ApiTags('User Notifications')
@ApiOAuth2([])
@UseGuards(IdsUserGuard, ScopesGuard)
@Controller('userNotifications')
export class UserNotificationsController {
  constructor(
    private readonly userNotificationsService: UserNotificationsService,
  ) {}

  // FINDALL
  @ApiOperation({
    summary: 'Return a list of all user devices with token and settings',
  })
  @ApiOkResponse({ type: [UserNotificationDto] })
  @Scopes(UserProfileScope.read)
  @ApiSecurity('oauth2', [UserProfileScope.read])
  @Get('/getDeviceTokens')
  async findAll(@CurrentUser() user: User): Promise<UserNotificationDto[]> {
    return await this.userNotificationsService.findAll(user)
  }

  // CREATE
  @ApiOperation({
    summary: 'Adds a token and notification settings for a user device',
  })
  @ApiOkResponse({ type: UserNotificationDto })
  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Post('/addDeviceToken')
  async create(
    @CurrentUser() user: User,
    @Body() body: CreateUserNotificationDto,
  ): Promise<UserNotificationDto> {
    body.nationalId = user.nationalId
    return await this.userNotificationsService.create(body)
  }

  // UPDATE
  @ApiOperation({
    summary: 'Updates notification settings for a user device',
  })
  @ApiOkResponse({ type: [CreateUserNotificationDto] })
  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Put('/updateDeviceToken/:id')
  async update(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateUserNotificationDto,
  ): Promise<CreateUserNotificationDto> {
    return await this.userNotificationsService.update(id, body, user)
  }

  // // DELETE ready for later
  // @Scopes(UserProfileScope.write)
  // @ApiSecurity('oauth2', [UserProfileScope.write])
  // @Delete('deleteDeviceToken/:id')
  // async remove(@CurrentUser() user: User, @Param('id') id: string) {
  //   return await this.userNotificationsService.remove(id)
  // }
}
