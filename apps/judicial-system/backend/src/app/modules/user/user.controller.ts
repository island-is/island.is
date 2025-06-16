import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
  TokenGuard,
} from '@island.is/judicial-system/auth'
import { type User as TUser } from '@island.is/judicial-system/types'

import {
  adminRule,
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  localAdminRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../guards'
import { CreateUserDto } from './dto/createUser.dto'
import { UpdateUserDto } from './dto/updateUser.dto'
import { CreateUserValidator } from './interceptors/createUser.validator'
import { UpdateUserValidator } from './interceptors/updateUser.validator'
import { UserInterceptor } from './interceptors/user.interceptor'
import { User } from './user.model'
import { UserService } from './user.service'

@Controller('api')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @RolesRules(localAdminRule, adminRule)
  @UseInterceptors(CreateUserValidator)
  @Post('user')
  @ApiCreatedResponse({ type: User, description: 'Creates a new user' })
  create(@Body() userToCreate: CreateUserDto): Promise<User> {
    this.logger.debug('Creating a new user')

    return this.userService.create(userToCreate)
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @RolesRules(localAdminRule, adminRule)
  @UseInterceptors(UpdateUserValidator)
  @Put('user/:userId')
  @ApiOkResponse({ type: User, description: 'Updates an existing user' })
  update(
    @Param('userId') userId: string,
    @Body() userToUpdate: UpdateUserDto,
  ): Promise<User> {
    this.logger.debug(`Updating user ${userId}`)

    return this.userService.update(userId, userToUpdate)
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @RolesRules(
    localAdminRule,
    adminRule,
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
    publicProsecutorStaffRule,
  )
  @UseInterceptors(UserInterceptor)
  @Get('users')
  @ApiOkResponse({
    type: User,
    isArray: true,
    description: 'Gets all existing users',
  })
  getAll(@CurrentHttpUser() user: TUser): Promise<User[]> {
    this.logger.debug('Getting all users')

    return this.userService.getAll(user)
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @RolesRules(localAdminRule, adminRule)
  @Get('user/:userId')
  @ApiOkResponse({
    type: User,
    description: 'Gets an existing user',
  })
  getById(@Param('userId') userId: string): Promise<User> {
    this.logger.debug(`Finding user ${userId}`)

    return this.userService.findById(userId)
  }

  @UseGuards(TokenGuard)
  @Get('user')
  @ApiOkResponse({
    type: User,
    isArray: true,
    description: 'Gets existing users by national id',
  })
  getByNationalId(@Query('nationalId') nationalId: string): Promise<User[]> {
    this.logger.debug('Getting a user by national id')

    return this.userService.findByNationalId(nationalId)
  }
}
