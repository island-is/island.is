import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'

import { UserRole } from '@island.is/judicial-system/types'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRule,
  RolesRules,
} from '@island.is/judicial-system/auth'

import { CreateUserDto, UpdateUserDto } from './dto'
import { User } from './user.model'
import { UserService } from './user.service'

// Allows admins to perform any action
const adminRule = UserRole.ADMIN as RolesRule

@Controller('api')
@ApiTags('users')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @RolesRules(adminRule)
  @Post('user')
  @ApiCreatedResponse({ type: User, description: 'Creates a new user' })
  create(
    @Body()
    userToCreate: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(userToCreate)
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
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

  @UseGuards(RolesGuard)
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

  /*
   * This endpoint is not guarded as it needs to respond to unauthenticated requests
   * from the authentication service.
   */
  @Get('user/:nationalId')
  @ApiOkResponse({ type: User, description: 'Gets an existing user' })
  async getByNationalId(@Param('nationalId') nationalId: string) {
    const user = await this.userService.findByNationalId(nationalId)

    if (!user) {
      throw new NotFoundException(`User ${nationalId} not found`)
    }

    return user
  }
}
