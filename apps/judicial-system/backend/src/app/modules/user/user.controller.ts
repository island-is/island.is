import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
  TokenGuard,
} from '@island.is/judicial-system/auth'

import { adminRule } from '../../guards'
import { CreateUserDto, UpdateUserDto } from './dto'
import { User } from './user.model'
import { UserService } from './user.service'

@Controller('api')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(adminRule)
  @Post('user')
  @ApiCreatedResponse({ type: User, description: 'Creates a new user' })
  create(
    @Body()
    userToCreate: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(userToCreate)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(adminRule)
  @Put('user/:id')
  @ApiOkResponse({ type: User, description: 'Updates an existing user' })
  async update(
    @Param('id') id: string,
    @Body() userToUpdate: UpdateUserDto,
  ): Promise<User> {
    const { numberOfAffectedRows, updatedUser } = await this.userService.update(
      id,
      userToUpdate,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`User ${id} does not exist`)
    }

    return updatedUser
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  @ApiOkResponse({
    type: User,
    isArray: true,
    description: 'Gets all existing users',
  })
  getAll(@CurrentHttpUser() user: User): Promise<User[]> {
    return this.userService.getAll(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  @ApiOkResponse({
    type: User,
    description: 'Gets an existing user',
  })
  async getById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findById(id)

    if (!user) {
      throw new NotFoundException(`User ${id} not found`)
    }

    return user
  }

  @UseGuards(TokenGuard)
  @Get('user')
  @ApiOkResponse({
    type: User,
    description: 'Gets an existing user by national id',
  })
  async getByNationalId(
    @Query('nationalId') nationalId: string,
  ): Promise<User> {
    const user = await this.userService.findByNationalId(nationalId)

    if (!user) {
      throw new NotFoundException(`User ${nationalId} not found`)
    }

    return user
  }
}
