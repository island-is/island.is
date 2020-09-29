import {
  Controller,
  UseGuards,
  Get,
  Req,
  NotFoundException,
  UnauthorizedException,
  Param,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'

import { AuthUser } from '../auth/auth.types'
import { JwtAuthGuard } from '../auth/auth.guard'
import { User } from './user.model'
import { UserRole } from './user.types'
import { UserService } from './user.service'

@UseGuards(JwtAuthGuard)
@Controller('api')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @ApiOkResponse({ type: User })
  async getCurrentUser(@Req() req) {
    const authUser: AuthUser = req.user

    const user = await this.userService.findByNationalId(authUser.nationalId)

    if (!user) {
      throw new NotFoundException(
        `User ${authUser && authUser.nationalId} not found`,
      )
    }

    return user
  }

  // Temporary endpoint to enable role changes
  @Get('user/:nationalId/admin')
  @ApiOkResponse({ type: User })
  async updateUserRole(
    @Param('nationalId') nationalId: string,
    @Query('role') role: UserRole,
    @Req() req,
  ): Promise<User> {
    const authUser: AuthUser = req.user

    const user = await this.userService.findByNationalId(authUser.nationalId)

    if (!user || !['2510654469', '1112902539'].includes(user.nationalId)) {
      throw new UnauthorizedException()
    }

    const {
      numberOfAffectedRows,
      updatedUser,
    } = await this.userService.setRoleByNationalId(nationalId, role)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        `A user with the national id ${nationalId} does not exist`,
      )
    }

    return updatedUser
  }
}
