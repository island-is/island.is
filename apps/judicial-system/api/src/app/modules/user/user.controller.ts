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
        `User ${authUser && authUser?.nationalId} not found`,
      )
    }

    return user
  }
}
