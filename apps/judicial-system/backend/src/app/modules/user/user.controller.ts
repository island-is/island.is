import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
  TokenGuard,
} from '@island.is/judicial-system/auth'

import { adminRule } from '../../guards'
import { CreateUserDto } from './dto/createUser.dto'
import { UpdateUserDto } from './dto/updateUser.dto'
import { User } from './user.model'
import { UserService } from './user.service'

@Controller('api')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(adminRule)
  @Post('user')
  @ApiCreatedResponse({ type: User, description: 'Creates a new user' })
  create(@Body() userToCreate: CreateUserDto): Promise<User> {
    this.logger.debug('Creating a new user')

    return this.userService.create(userToCreate)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(adminRule)
  @Patch('user/:userId')
  @ApiOkResponse({ type: User, description: 'Updates an existing user' })
  update(
    @Param('userId') userId: string,
    @Body() userToUpdate: UpdateUserDto,
  ): Promise<User> {
    this.logger.debug(`Updating user ${userId}`)

    return this.userService.update(userId, userToUpdate)
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  @ApiOkResponse({
    type: User,
    isArray: true,
    description: 'Gets all existing users',
  })
  getAll(@CurrentHttpUser() user: User): Promise<User[]> {
    this.logger.debug('Getting all users')

    return this.userService.getAll(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  @ApiOkResponse({
    type: User,
    description: 'Gets an existing user',
  })
  async getById(@Param('userId') userId: string): Promise<User> {
    this.logger.debug(`Finding user ${userId}`)

    return this.userService.findById(userId)
  }

  @UseGuards(TokenGuard)
  @Get('user')
  @ApiOkResponse({
    type: User,
    description: 'Gets an existing user by national id',
  })
  getByNationalId(@Query('nationalId') nationalId: string): Promise<User> {
    this.logger.debug('Getting a user by national id')

    return this.userService.findByNationalId(nationalId)
  }
}
